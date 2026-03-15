import { AxiosError } from 'axios';

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as any;

    return (
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.message ||
      'Request failed'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error';
}
