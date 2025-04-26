import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { eaApi } from "@/lib/axios.ts";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const MetricsSchemaResponse = z.object({
	reservations: z.number(),
	academicSpaces: z.number(),
	users: z.number(),
});

export type Metrics = z.infer<typeof MetricsSchemaResponse>;

export async function getCountMetrics(signal: AbortSignal): Promise<Metrics> {
	const response = await eaApi.get<Metrics>("/admin/metrics/count", {
		signal,
	});

	return MetricsSchemaResponse.parse(response.data);
}

export type UseMetricsQueryOptions = UseQueryOptions<Metrics, EaApiException>;

export function useMetricsQuery(props?: UseMetricsQueryOptions) {
	return useQuery({
		...props,
		queryFn: ({ signal }) => getCountMetrics(signal),
		queryKey: ["metrics"],
	});
}
