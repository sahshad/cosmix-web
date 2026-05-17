export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  code?: string;
  message: string;
  field?: string;
};

export type ApiError = {
  code?: string;
  message: string;
  field?: string;
}