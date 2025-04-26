import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import type { DefineQueryOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const getAvailableAcademicSpacesResponseSchema = z.array(
	z.object({
		id: z.string(),
		roomName: z.string(),
		acronym: z.string(),
		description: z.string(),
		capacity: z.number(),
		status: z.string(),
		available: z.boolean(),
	}),
);

export type GetAvailableAcademicSpacesResponse = z.infer<
	typeof getAvailableAcademicSpacesResponseSchema
>;

export type GetAvailableAcademicSpacesQueryOptions = DefineQueryOptions<
	GetAvailableAcademicSpacesResponse,
	EaApiException
>;

export async function getAvailableAcademicSpaces(signal?: AbortSignal) {
	const { data } = await eaApi.get<GetAvailableAcademicSpacesResponse>(
		"/spaces/available",
		{
			signal,
		},
	);

	return getAvailableAcademicSpacesResponseSchema.parse(data);
}

export const getAvailableAcademicSpacesQueryKey = () => ["spaces/available"];

export const getAvailableAcademicSpacesQueryOptions = (
	options?: GetAvailableAcademicSpacesQueryOptions,
) =>
	queryOptions({
		...options,
		queryKey: options?.queryKey ?? getAvailableAcademicSpacesQueryKey(),
		queryFn: ({ signal }) => getAvailableAcademicSpaces(signal),
	});

export function useGetAvailableAcademicSpaces(
	options?: GetAvailableAcademicSpacesQueryOptions,
) {
	return useQuery(getAvailableAcademicSpacesQueryOptions(options));
}
