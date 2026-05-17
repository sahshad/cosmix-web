import { ApiError, ApiErrorResponse } from '@/types';
import { AxiosError } from 'axios';

export function extractApiError(
  error: unknown,
): ApiError {

  if (error instanceof AxiosError) {

    const data = error.response?.data as ApiErrorResponse;

    if (data?.message) {
      return data;
    }

    return {
      message: error.message || 'Request failed',
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'Unexpected error',
  };
}