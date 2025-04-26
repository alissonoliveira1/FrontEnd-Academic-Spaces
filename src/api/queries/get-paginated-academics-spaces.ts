import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import {
	paginatedFiltersParamsSchema,
	paginatedResponseSchema,
} from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import {
	type UseQueryOptions,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { z } from "zod";

export const SpaceStatusEnum = z.enum(["UNAVAILABLE", "AVAILABLE"]);

export const spaceFiltersSchema = paginatedFiltersParamsSchema.extend({
	nmFilterColumn: z.string().default("").optional(),
	nmFilterValue: z.string().min(1).trim().default("").optional(),
});

const spaceSchema = z.object({
	id: z.string(),
	roomName: z.string(),
	acronym: z.string(),
	description: z.string(),
	capacity: z.number(),
	status: z.enum(["UNAVAILABLE", "AVAILABLE"]),
	available: z.boolean(),
});

export type Space = z.infer<typeof spaceSchema>;

export const getAcademicSpacesResponseSchema = paginatedResponseSchema.extend({
	content: z.array(spaceSchema),
});
export type GetAcademicSpacesResponse = z.infer<
	typeof getAcademicSpacesResponseSchema
>;
export type GetAcademicSpacesParams = z.infer<typeof spaceFiltersSchema>;
export type AcademicSpace = z.infer<typeof spaceSchema>;

export type UseGetAcademicSpacesQueryOptions = UseQueryOptions<
	GetAcademicSpacesResponse,
	EaApiException
>;

export async function getAcademicSpaces(
	params: GetAcademicSpacesParams,
	signal?: AbortSignal,
): Promise<GetAcademicSpacesResponse> {
	const { data } = await eaApi.get<GetAcademicSpacesResponse>("/admin/spaces", {
		params: spaceFiltersSchema.parse(params),
		signal,
	});

	return getAcademicSpacesResponseSchema.parse(data);
}

export const getAcademicSpacesQueryKey = (params: GetAcademicSpacesParams) => [
	"academic-spaces",
	params,
];

export const getAcademicSpacesQueryOptions = (
	params: GetAcademicSpacesParams,
	options?: UseGetAcademicSpacesQueryOptions,
): UseGetAcademicSpacesQueryOptions =>
	queryOptions<GetAcademicSpacesResponse, EaApiException>({
		...options,
		queryFn: ({ signal }) => getAcademicSpaces(params, signal),
		queryKey: getAcademicSpacesQueryKey(params),
	});

export function useGetAcademicSpaces(
	params: GetAcademicSpacesParams,
	options?: UseGetAcademicSpacesQueryOptions,
) {
	const queryOptions = getAcademicSpacesQueryOptions(params, {
		...options,
		queryKey: options?.queryKey ?? getAcademicSpacesQueryKey(params),
	});

	return useQuery(queryOptions);
}
