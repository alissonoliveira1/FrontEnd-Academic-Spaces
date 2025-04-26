import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { eaApi } from "@/lib/axios.ts";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

const getReservationByAcademicSpacesMetricSchema = z.array(
	z.object({
		academicspaceid: z.string(),
		roomname: z.string(),
		acronym: z.string(),
		count: z.number(),
	}),
);

export type GetReservationByAcademicSpacesMetricResponse = z.infer<
	typeof getReservationByAcademicSpacesMetricSchema
>;

export async function getReservationByAcademicSpacesMetric(
	signal: AbortSignal,
): Promise<GetReservationByAcademicSpacesMetricResponse> {
	const { data } =
		await eaApi.get<GetReservationByAcademicSpacesMetricResponse>(
			"/admin/metrics/reservations-by-academic-space-last-7-days",
			{
				signal,
			},
		);

	return data;
}

export type UseGetReservationByAcademicSpacesMetricQueryOptions =
	UseQueryOptions<GetReservationByAcademicSpacesMetricResponse, EaApiException>;

export function useGetReservationByAcademicSpacesMetricQuery(
	props?: UseGetReservationByAcademicSpacesMetricQueryOptions,
) {
	return useQuery({
		...props,
		queryFn: ({ signal }) => getReservationByAcademicSpacesMetric(signal),
		queryKey: ["getReservationByAcademicSpacesMetric"],
	});
}
