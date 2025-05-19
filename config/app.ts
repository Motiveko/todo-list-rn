import { addRequestInterceptor, removeRequestInterceptor } from "@/lib/http";

let interceptorId: number;
export const configHttpClientAuthentication = (jwt: string | null) => {
  if (jwt) {
    addRequestInterceptor((config) => {
      console.log(`[${config.method}] url: ${config.url}`);
      return config;
    });

    interceptorId = addRequestInterceptor((config) => {
      config.headers.Authorization = `Bearer ${jwt}`;
      return config;
    });
  } else if (interceptorId) {
    removeRequestInterceptor(interceptorId);
  }
};
