import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import {
	paginatedFiltersParamsSchema,
	paginatedResponseSchema,
} from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import {
	type QueryOptions,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { z } from "zod";

export const reservationSchema = z.object({
	id: z.string(),
	startDateTime: z.string(),
	endDateTime: z.string(),
	academicSpace: z.object({
		id: z.string(),
		roomName: z.string(),
		acronym: z.string(),
		description: z.string(),
		capacity: z.number(),
		status: z.string(),
		available: z.boolean(),
	}),
	user: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		role: z.string(),
	}),

	status: z
		.enum([
			"CONFIRMED_BY_THE_USER",
			"CONFIRMED_BY_THE_ENTERPRISE",
			"CANCELED",
			"SCHEDULED",
		])
		.or(z.string()),
	confirmed: z.boolean().optional().default(false),
	confirmedByTheUser: z.boolean().optional().default(false),
	confirmedVyEnterprise: z.boolean().optional().default(false),
	isScheduled: z.boolean().optional().default(false),
	canceled: z.boolean().optional().default(false),
});

export const getReservationsResponseSchema = paginatedResponseSchema.extend({
	content: z.array(reservationSchema),
});
export const getReservationsParamsSchema = paginatedFiltersParamsSchema.extend({
	nmFilterColumn: z.string().default("").optional(),
	nmFilterValue: z.string().min(1).trim().default("").optional(),
});

export type Reservation = z.infer<typeof reservationSchema>;
export type GetReservationsParams = z.infer<typeof getReservationsParamsSchema>;
export type GetReservationsResponse = z.infer<
	typeof getReservationsResponseSchema
>;
export type GetReservationsQueryOptions = QueryOptions<
	GetReservationsResponse,
	EaApiException
>;

export async function getReservations(
	params: GetReservationsParams,
	signal?: AbortSignal,
) {
	const { data } = await eaApi.get<GetReservationsResponse>(
		"/admin/reservations",
		{
			params: getReservationsParamsSchema.parse(params),
			signal,
		},
	);

	return getReservationsResponseSchema.parse(data);
}

export const getReservationsQueryKey = (params: GetReservationsParams) => [
	"reservations",
	params,
];
export const getReservationsQueryOptions = (
	params: GetReservationsParams,
	options?: GetReservationsQueryOptions,
) => {
	return queryOptions({
		...options,
		queryKey: getReservationsQueryKey(params),
		queryFn: ({ signal }) => getReservations(params, signal),
	});
};

export function useGetReservationsQuery(
	parmas: GetReservationsParams,
	options?: GetReservationsQueryOptions,
) {
	const queryOptions = getReservationsQueryOptions(parmas, options);

	return useQuery(queryOptions);
}
