import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import type { DefineQueryOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const UserSchema = z.object({
	email: z.string(),
	id: z.string(),
	name: z.string(),
	role: z.string(),
	schoolUnit: z
		.object({
			id: z.string().uuid().optional(),
			name: z.string().optional(),
			type: z.string().optional(),
			state: z.string().optional(),
			city: z.string().optional(),
			address: z.string().optional(),
			contactNumber: z.string().optional(),
			createdAt: z.coerce.date().optional(),
		})
		.nullable(),
});

export const getUsersSchemasResponse = z.object({
	content: z.array(UserSchema),
	page: z.number(),
	pageSize: z.number(),
	totalOfPages: z.number(),
});

export const getUsersQueryParamsSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	pageSize: z.coerce.number().min(10).default(10),
});

export type GetTeachersResponse = z.infer<typeof getUsersSchemasResponse>;
export type GetTeachersQueryParams = z.infer<typeof getUsersQueryParamsSchema>;
export type User = z.infer<typeof UserSchema>;

export async function getUsers(
	params: GetTeachersQueryParams,
	signal: AbortSignal,
): Promise<GetTeachersResponse> {
	const { data } = await eaApi.get<GetTeachersResponse>("/admin/users", {
		params: getUsersQueryParamsSchema.parse(params),
		signal,
	});

	console.log(getUsersSchemasResponse.safeParse(data));

	return getUsersSchemasResponse.parse(data);
}

export type UseGetTeachersQueryOptions = DefineQueryOptions<
	GetTeachersResponse,
	EaApiException
>;

export const getUsersQueryKey = (params: GetTeachersQueryParams) => [
	"users",
	params,
];

export function useGetUsersQuery(
	params: GetTeachersQueryParams,
	options?: UseGetTeachersQueryOptions,
) {
	return useQuery({
		...options,
		queryFn: ({ signal }) => getUsers(params, signal),
		queryKey: getUsersQueryKey(params),
	});
}
