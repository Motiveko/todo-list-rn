import { z } from "zod";
import httpClient from "@/lib/http";
import { DataAndMessageResponse } from "@/apis";

export interface Todo {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
}
export interface CreateTodoDto {
  title: string;
  description: string;
}
const TodoSchema: z.ZodType<Todo> = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  isDone: z.boolean(),
  createdAt: z.coerce.date(),
});

const ListApiResponseSchema: z.ZodType<DataAndMessageResponse<Todo[]>> =
  z.object({
    data: z.array(TodoSchema),
    message: z.string(),
  });

const CreateApiResponseSchema: z.ZodType<DataAndMessageResponse<Todo>> =
  z.object({
    data: TodoSchema,
    message: z.string(),
  });

export const list = async () => {
  const response = await httpClient.get<typeof ListApiResponseSchema>(
    "/api/v1/todo",
    {
      schema: ListApiResponseSchema,
    }
  );
  return response.data;
};

export const create = async (body: CreateTodoDto) => {
  const response = await httpClient.post<typeof CreateApiResponseSchema>(
    "/api/v1/todo",
    {
      schema: CreateApiResponseSchema,
      data: body,
    }
  );
  return response.data;
};

const _delete = async (id: number) => {
  await httpClient.delete(`/api/v1/todo/${id}`);
};

// delete 예약어 충돌 문제로 사용 불가능해서 별도 export 처리
export { _delete as delete };
