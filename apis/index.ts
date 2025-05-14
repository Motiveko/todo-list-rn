import * as user from "@/apis/user";

export interface DataAndMessageResponse<T> extends ApiResponse<T> {
  message: string;
}
export interface ApiResponse<T> {
  data: T;
}

export const API = {
  user,
};
