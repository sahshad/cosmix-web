import { UseInfiniteQueryOptions, useQueryClient } from '@tanstack/react-query';

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
}

export interface InfiniteQueryConfig<TData, TResponse> {
  queryKey: readonly unknown[];
  fetchPage: (page: number, limit: number) => Promise<TResponse>;
  limit?: number;
  enabled?: boolean;
  getItems: (response: TResponse) => TData[];
  getPagination: (response: TResponse) => PaginationInfo;
}

export function createInfiniteQueryOptions<TData, TResponse>(
  config: InfiniteQueryConfig<TData, TResponse>
): UseInfiniteQueryOptions<TResponse, Error, { pages: TResponse[]; pageParams: number[] }, readonly unknown[], number> {
  const { queryKey, fetchPage, limit = 20, enabled = true, getPagination } = config;

  return {
    queryKey: [...queryKey, 'infinite', limit],
    queryFn: ({ pageParam = 1 }) => fetchPage(pageParam as number, limit),
    getNextPageParam: (lastPage) => {
      const pagination = getPagination(lastPage);
      const currentPage = pagination?.page ?? 1;
      const totalPages = pagination?.totalPages ?? 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled,
  };
}

export function flattenInfinitePages<TData, TResponse>(
  data: { pages: TResponse[]; pageParams: number[] } | undefined,
  getItems: (response: TResponse) => TData[]
): TData[] {
  return data?.pages.flatMap((page) => getItems(page)) ?? [];
}

export function updateInfiniteQueryCache<TData, TResponse>(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: readonly unknown[],
  itemId: string | number,
  getItems: (response: TResponse) => TData[],
  getItemId: (item: TData) => string | number,
  updater: (item: TData) => TData | null
) {
  queryClient.setQueryData<{ pages: TResponse[]; pageParams: number[] }>(queryKey, (old: { pages: TResponse[]; pageParams: number[] } | undefined) => {
    if (!old || !old.pages) return old;
    return {
      ...old,
      pages: old.pages.map((page: TResponse) => {
        const items = getItems(page);
        const updatedItems = items.map((item) => {
          if (getItemId(item) === itemId) {
            const updated = updater(item);
            return updated === null ? undefined : updated;
          }
          return item;
        }).filter(Boolean) as TData[];
        // Use type assertion to avoid 'any' - the page structure is maintained
        return { ...page, items: updatedItems } as TResponse;
      }),
    };
  });
}