import { z } from "zod";
import httpClient from "@/lib/http";
import type { DataAndMessageResponse } from "@/apis";

export interface User {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string;
  createdAt: Date;
}

const UserSchema: z.ZodType<User> = z.object({
  id: z.number(),
  email: z.string(),
  displayName: z.string(),
  avatarUrl: z.string(),
  // TODO: coerce보다 transform이 더 좋을거같은데 현재는 타입이 안맞음. 해결 방법 찾아봐야함
  // createdAt: z
  //   .string()
  //   .datetime({ offset: true }) // ISO 8601 형식 강제
  //   .transform((str) => new Date(str)), // 문자열 검증 후 Date 객체로 변환
  createdAt: z.coerce.date(),
});

export const logout = async () => {
  await httpClient.post("/api/v1/auth/logout");
};

const GetUserResponseSchema: z.ZodType<DataAndMessageResponse<User>> = z.object(
  {
    data: UserSchema,
    message: z.string(),
  }
);

export const get = async () => {
  const response = await httpClient.get<typeof GetUserResponseSchema>(
    "/api/v1/user",
    {
      schema: GetUserResponseSchema,
    }
  );

  return response.data;
};

const LoginResponseSchema: z.ZodType<{
  accessToken: string;
  refreshToken?: string;
}> = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export const login = async ({
  token,
  clientId,
}: {
  token: string;
  clientId: string;
}) => {
  const response = await httpClient.post("/api/v1/auth/google/app", {
    data: { token, clientId },
    schema: LoginResponseSchema,
  });

  return response;
};
