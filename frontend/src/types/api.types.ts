export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginationParams {
  pageNumber?: number;
  recLimit?: number;
  search?: string;
}

export interface ApiError {
  status: boolean;
  message: string;
  data: null;
}