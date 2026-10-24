import { QueryClient, QueryKey, UseInfiniteQueryOptions } from '@tanstack/react-query';

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

export interface CacheItemUpdate<TData, TResponse> {
    itemId: string | number;
    getItems: (response: TResponse) => TData[];
    setItems: (response: TResponse, items: TData[]) => TResponse;
    getItemId: (item: TData) => string | number;
    /** Return null to remove the item from the cache. */
    updater: (item: TData) => TData | null;
}

const applyItemUpdater = <TData>(
    items: TData[],
    itemId: string | number,
    getItemId: (item: TData) => string | number,
    updater: (item: TData) => TData | null
): TData[] =>
    items.reduce<TData[]>((acc, item) => {
        if (String(getItemId(item)) !== String(itemId)) return acc.concat(item);
        const updated = updater(item);
        return updated ? acc.concat(updated) : acc;
    }, []);

/**
 * Updates a single item inside every cached query matching `queryKey`.
 * Handles both flat-array caches (e.g. replies) and infinite-query caches
 * (e.g. paginated comments), writing the updated items back into the exact
 * field they came from.
 */
export function updateCachedItems<TData, TResponse>(
    queryClient: QueryClient,
    queryKey: readonly unknown[],
    { itemId, getItems, setItems, getItemId, updater }: CacheItemUpdate<TData, TResponse>
): void {
    queryClient.setQueriesData<unknown>({ queryKey }, (old: unknown) => {
        if (!old) return old;

        if (Array.isArray(old)) {
            return applyItemUpdater(old as TData[], itemId, getItemId, updater);
        }

        const pages = (old as { pages?: TResponse[] }).pages;
        if (!Array.isArray(pages)) return old;

        return {
            ...(old as Record<string, unknown>),
            pages: pages.map((page) =>
                setItems(page, applyItemUpdater(getItems(page), itemId, getItemId, updater))
            ),
        };
    });
}

/**
 * Shared optimistic-update flow: cancels in-flight refetches, snapshots the
 * affected caches, patches the item locally, and returns a rollback callback.
 *
 * Every query key is treated as a prefix, so one item living in several
 * caches (a post in the feed and on a profile, a comment in the comments list
 * and in a reply list) is patched everywhere at once.
 */
export async function applyOptimisticUpdate<TData, TResponse>(
    queryClient: QueryClient,
    queryKeys: readonly (readonly unknown[])[],
    update: CacheItemUpdate<TData, TResponse>
): Promise<() => void> {
    await Promise.all(queryKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })));

    const snapshot = queryKeys.flatMap((queryKey) =>
        queryClient.getQueriesData({ queryKey })
    ) as [QueryKey, unknown][];

    queryKeys.forEach((queryKey) => updateCachedItems(queryClient, queryKey, update));

    return () => {
        snapshot.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
        });
    };
}