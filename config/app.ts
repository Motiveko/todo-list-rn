import { addRequestInterceptor, removeRequestInterceptor } from "@/lib/http";

let interceptorId: number;
export const configHttpClientAuthentication = (jwt: string | null) => {
  if (jwt) {
    interceptorId = addRequestInterceptor((config) => {
      config.headers.Authorization = `Bearer ${jwt}`;
      return config;
    });
  } else if (interceptorId) {
    removeRequestInterceptor(interceptorId);
  }
};
