import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { eaApi } from "@/lib/axios.ts";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const TeacherSchema = z.object({
	email: z.string(),
    phone: z.string(),
    id: z.string(),
	name: z.string(),
    createdAt: z.date(),
	role: z.string(),
});

export const getTeachersSchemasResponse = z.object({
	content: z.array(TeacherSchema),
	page: z.number(),
	pageSize: z.number(),
	totalOfPages: z.number(),
});

export const getTeachersQueryParamsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(10).default(10),
});

export type GetTeachersResponse = z.infer<typeof getTeachersSchemasResponse>;
export type GetTeachersQueryParams = z.infer<typeof getTeachersQueryParamsSchema>;
export type Teacher = z.infer<typeof TeacherSchema>;

export async function getTeachers(
   
	params: GetTeachersQueryParams,
	signal: AbortSignal,
): Promise<GetTeachersResponse> {
	const { data } = await eaApi.get<GetTeachersResponse>(`/12/teachers`, {
		params: getTeachersQueryParamsSchema.parse(params),
		signal,
	});

	return getTeachersSchemasResponse.parse(data);
}

export type UseGetTeachersQueryOptions = UseQueryOptions<
	GetTeachersResponse,
	EaApiException
>;

export const getTeachersQueryKey = (params: GetTeachersQueryParams) => [
	"teachers",
	params,
];

export function useGetTeachersQuery(
	params: GetTeachersQueryParams,
	options?: UseGetTeachersQueryOptions,
) {
	return useQuery({
		...options,
		queryFn: ({ signal }) => getTeachers( params, signal),
		queryKey: getTeachersQueryKey(params),
	});
}
