import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import type { DefineQueryOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const getAllAcademicSpacesSchemaResponse = z.array(
	z.object({
		id: z.string(),
		roomName: z.string(),
		acronym: z.string(),
		description: z.string(),
		capacity: z.number(),
		status: z.enum(["UNAVAILABLE", "AVAILABLE"]),
		available: z.boolean(),
	}),
);

export type GetAllAcademicSpacesResponse = z.infer<
	typeof getAllAcademicSpacesSchemaResponse
>;

export const getAllAcademicSpacesQueryKey = () => ["all-academic-spaces"];

export type Query = DefineQueryOptions<
	GetAllAcademicSpacesResponse,
	EaApiException
>;

export async function getAllAcademicSpaces(signal?: AbortSignal) {
	const { data } = await eaApi.get<GetAllAcademicSpacesResponse>(
		"/admin/spaces/all",
		{ signal },
	);

	return getAllAcademicSpacesSchemaResponse.parse(data);
}

export function useGetAllAcademicSpaces(options?: Query) {
	return useQuery({
		...options,
		queryKey: options?.queryKey ?? getAllAcademicSpacesQueryKey(),
		queryFn: ({ signal }) => getAllAcademicSpaces(signal),
	});
}
