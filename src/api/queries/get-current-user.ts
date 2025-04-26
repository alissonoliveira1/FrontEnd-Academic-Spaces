import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import type { DefineQueryOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const getCurrentUserResponseSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	id: z.string(),
	role: z.enum(["ADMIN", "TEACHER"]),
});

export type GetCurrentUserResponse = z.infer<
	typeof getCurrentUserResponseSchema
>;

export type GetCurrentUserQueryOptions = DefineQueryOptions<
	GetCurrentUserResponse,
	EaApiException
>;

export type User = GetCurrentUserResponse;

export async function getCurrentUser(
	signal?: AbortSignal,
): Promise<GetCurrentUserResponse> {
	const { data } = await eaApi.get<GetCurrentUserResponse>("/users/me", {
		signal,
	});

	return data;
}

export const createGetCurrentUserQueryKey = () => ["get-current-user"];

export function useGetCurrentUser(props?: GetCurrentUserQueryOptions) {
	return useQuery({
		...props,
		queryFn: ({ signal }) => getCurrentUser(signal),
		queryKey: props?.queryKey ?? createGetCurrentUserQueryKey(),
	});
}
