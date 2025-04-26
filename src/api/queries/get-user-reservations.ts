import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { reservationSchema } from "@/api/queries/get-reservations.ts";
import {
	type DefineQueryOptions,
	paginatedFiltersParamsSchema,
	paginatedResponseSchema,
} from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const getUserReservationsSchemaResponse = paginatedResponseSchema.extend(
	{
		content: z.array(reservationSchema),
	},
);

export const getUserReservationsParamsSchema =
	paginatedFiltersParamsSchema.extend({
		status: z.string().optional(),
	});

export type GetUserReservationsParams = z.infer<
	typeof getUserReservationsParamsSchema
>;
export type GetUserReservationsResponse = z.infer<
	typeof getUserReservationsSchemaResponse
>;

export type UseGetUserReservationsQueryOptions = DefineQueryOptions<
	GetUserReservationsResponse,
	EaApiException
>;

export async function getUserReservations(
	params: GetUserReservationsParams,
	signal: AbortSignal,
) {
	const { data } = await eaApi.get<GetUserReservationsResponse>(
		"/reservations",
		{
			params: getUserReservationsParamsSchema.parse(params),
			signal,
		},
	);

	return getUserReservationsSchemaResponse.parse(data);
}

export const queryKey = "user-reservations";

export const getUserReservationsQueryKey = (
	params: GetUserReservationsParams,
) => [queryKey, params];

export const getUserReservationsQueryOptions = (
	params: GetUserReservationsParams,
	options?: UseGetUserReservationsQueryOptions,
) => {
	return queryOptions<GetUserReservationsResponse, EaApiException>({
		...options,
		queryKey: getUserReservationsQueryKey(params),
		queryFn: ({ signal }) => getUserReservations(params, signal),
	});
};

export function useGetUserReservations(
	params: GetUserReservationsParams,
	options?: UseGetUserReservationsQueryOptions,
) {
	const queryOptions = getUserReservationsQueryOptions(params, {
		...options,
		queryKey: options?.queryKey ?? getUserReservationsQueryKey(params),
	});

	return useQuery(queryOptions);
}
