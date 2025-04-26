import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { eaApi } from "@/lib/axios.ts";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

import { z } from "zod";

export const ReservationCountMetricInWeekSchema = z.array(
	z.object({
		dayofweek: z.number(),
		count: z.number(),
	}),
);

export type ReservationCountMetricInWeek = z.infer<
	typeof ReservationCountMetricInWeekSchema
>;

// Define the function to fetch metrics
export async function getReservationInWeekCountMetric(
	signal: AbortSignal,
): Promise<ReservationCountMetricInWeek> {
	const response = await eaApi.get<ReservationCountMetricInWeek>(
		"/admin/metrics/reservations-by-day-of-week",
		{
			signal,
		},
	);
	return ReservationCountMetricInWeekSchema.parse(response.data);
}

export type UseMetricsQueryOptions = UseQueryOptions<
	ReservationCountMetricInWeek,
	EaApiException
>;

export function useGetReservationInWeekCountMetricQuery(
	props?: UseMetricsQueryOptions,
) {
	return useQuery({
		...props,
		queryFn: ({ signal }) => getReservationInWeekCountMetric(signal),
		queryKey: ["getReservationInWeekCountMetric"],
	});
}
