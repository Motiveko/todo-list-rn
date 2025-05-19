import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError as AxiosLibError,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import type { z, ZodTypeAny } from "zod";
import type { SetRequired } from "type-fest";
import { HttpError, ValidationError, NetworkError } from "@/errors/http";
import { Config } from "@/config/env";

const logger = console;

type RequestConfig = SetRequired<AxiosRequestConfig, "method">;
type RequestConfigWithSchema<T extends ZodTypeAny> = RequestConfig & {
  schema: T;
};

type MethodHttpRequestConfig = Omit<RequestConfig, "method" | "url">;
type MethodHttpRequestConfigWithSchema<T extends ZodTypeAny> =
  MethodHttpRequestConfig & { schema: T };

const axiosInstance: AxiosInstance = axios.create({
  baseURL: Config.apiHost,
  timeout: 10000, // 10초 타임아웃
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => {
    // 요청 설정 중 에러 발생 시
    console.error("Request Error Interceptor:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosLibError) => {
    // 여기서 catch된 에러는 아래 request 함수 내의 catch 블록으로 전달
    // 전역적인 에러 로깅이나 특정 상태 코드(예: 401 Unauthorized) 처리를 여기서 할 수 있음
    console.error(error);

    // 여기서 커스텀 에러를 throw하지 않고, request 함수 내에서 처리하도록 에러를 그대로 반환
    return Promise.reject(error);
  }
);

// 응답 인터셉터 관리
const responseInterceptorManager = axiosInstance.interceptors.response;

/**
 * 응답 에러 인터셉터를 동적으로 추가합니다.
 * @param onRejected 에러 발생 시 실행될 콜백 함수
 * @returns 추가된 인터셉터의 ID
 */
export const addErrorResponseInterceptor = (
  onRejected: (error: any) => any
): number => {
  return responseInterceptorManager.use(
    (response) => response, // 성공 콜백은 기본 동작 유지
    onRejected
  );
};

/**
 * ID를 사용하여 응답 에러 인터셉터를 제거합니다.
 * @param interceptorId 제거할 인터셉터의 ID
 */
export const removeErrorResponseInterceptor = (interceptorId: number): void => {
  responseInterceptorManager.eject(interceptorId);
};

// 요청 인터셉터 관리
const requestInterceptorManager = axiosInstance.interceptors.request;

/**
 * 요청 인터셉터를 동적으로 추가합니다.
 * @param onFulfilled 요청 성공 시 실행될 콜백 함수
 * @param onRejected 요청 에러 시 실행될 콜백 함수 (선택 사항)
 * @returns 추가된 인터셉터의 ID
 */
export const addRequestInterceptor = (
  onFulfilled: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
  onRejected?: (error: any) => any
): number => {
  return requestInterceptorManager.use(onFulfilled, onRejected);
};

/**
 * ID를 사용하여 요청 인터셉터를 제거합니다.
 * @param interceptorId 제거할 인터셉터의 ID
 */
export const removeRequestInterceptor = (interceptorId: number): void => {
  requestInterceptorManager.eject(interceptorId);
};

/**
 * HTTP 요청 함수 (Zod 스키마로 응답 유효성 검사)
 * @param config Axios 요청 설정 및 Zod 스키마 포함
 * @returns 유효성 검사를 통과한 데이터 | Promise<void>
 * @throws {HttpError | ValidationError | NetworkError}
 */
async function request<T extends ZodTypeAny>(
  config: RequestConfigWithSchema<T>
): Promise<z.infer<T>>;
async function request(config: RequestConfig): Promise<void>;
async function request<T extends ZodTypeAny>(
  config: RequestConfigWithSchema<T> | RequestConfig
): Promise<z.infer<T> | void> {
  try {
    const response: AxiosResponse = await axiosInstance(config);
    const data = response.data;

    if ("schema" in config) {
      const validationResult = config.schema.safeParse(data);
      if (validationResult.success) {
        return validationResult.data; // Promise<z.infer<T>>
      }
      logger.error(validationResult.error);
      throw new ValidationError(
        "Response validation failed",
        validationResult.error
      );
    } else {
      // Promise<void>
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosLibError;
      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data;
      const originalMessage = axiosError.message;

      if (axiosError.response) {
        // 서버가 응답했지만 상태 코드가 2xx 범위를 벗어난 경우 (4xx, 5xx)
        throw new HttpError(
          `Request failed with status code ${status}`,
          status,
          responseData,
          axiosError // 원본 Axios 에러 포함
        );
      } else if (axiosError.request) {
        // 요청은 이루어졌으나 응답을 받지 못한 경우 (네트워크 오류 등)
        throw new NetworkError(
          "No response received from server. Check network connection.",
          axiosError
        );
      } else {
        // 요청 설정 중 에러 발생 등 그 외 Axios 관련 에러
        throw new NetworkError(
          `Failed to set up request: ${originalMessage}`,
          axiosError
        );
      }
    } else {
      // Axios 에러가 아닌 다른 종류의 에러 (예: 코드 실행 오류)
      // TODO : 그냥 Error를 던지는 식으로
      throw new HttpError(
        "An unexpected error occurred",
        undefined, // 상태 코드 없음
        undefined,
        error instanceof Error ? error : undefined // 원본 에러가 Error 인스턴스면 포함
      );
    }
  }
}

interface HttpClient {
  get: (<T extends ZodTypeAny>(
    url: string,
    config: MethodHttpRequestConfigWithSchema<T>
  ) => Promise<z.infer<T>>) &
    ((url: string, config?: MethodHttpRequestConfig) => Promise<void>);

  post: (<T extends ZodTypeAny>(
    url: string,
    config: MethodHttpRequestConfigWithSchema<T>
  ) => Promise<z.infer<T>>) &
    ((url: string, config?: MethodHttpRequestConfig) => Promise<void>);

  put: (<T extends ZodTypeAny>(
    url: string,
    config: MethodHttpRequestConfigWithSchema<T>
  ) => Promise<z.infer<T>>) &
    ((url: string, config?: MethodHttpRequestConfig) => Promise<void>);

  delete: (<T extends ZodTypeAny>(
    url: string,
    config: MethodHttpRequestConfigWithSchema<T>
  ) => Promise<z.infer<T>>) &
    ((url: string, config?: MethodHttpRequestConfig) => Promise<void>);

  patch: (<T extends ZodTypeAny>(
    url: string,
    config: MethodHttpRequestConfigWithSchema<T>
  ) => Promise<z.infer<T>>) &
    ((url: string, config?: MethodHttpRequestConfig) => Promise<void>);
}

const httpClient: HttpClient = {
  get: <T extends ZodTypeAny>(
    url: string,
    config?: MethodHttpRequestConfigWithSchema<T> | MethodHttpRequestConfig
  ): Promise<z.infer<T> | void> => {
    return request({ ...config, url, method: "GET" });
  },

  post: <T extends ZodTypeAny>(
    url: string,
    config?: MethodHttpRequestConfigWithSchema<T> | MethodHttpRequestConfig
  ): Promise<z.infer<T> | void> => {
    return request({ ...config, url, method: "POST" });
  },

  put: <T extends ZodTypeAny>(
    url: string,
    config?: MethodHttpRequestConfigWithSchema<T> | MethodHttpRequestConfig
  ): Promise<z.infer<T> | void> => {
    return request({ ...config, url, method: "PUT" });
  },

  delete: <T extends ZodTypeAny>(
    url: string,
    config?: MethodHttpRequestConfigWithSchema<T> | MethodHttpRequestConfig
  ): Promise<z.infer<T> | void> => {
    return request({ ...config, url, method: "DELETE" });
  },

  patch: <T extends ZodTypeAny>(
    url: string,
    config?: MethodHttpRequestConfigWithSchema<T> | MethodHttpRequestConfig
  ): Promise<z.infer<T> | void> => {
    return request({ ...config, url, method: "PATCH" });
  },
};

export default httpClient;
