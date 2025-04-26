import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { createReservationParamsSchema } from "@/api/mutations/create-reservation.ts";
import type { DefineMutationOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const updateReservationParamsSchema =
	createReservationParamsSchema.extend({
		reservationId: z.string().uuid(),
	});

export type UpdateReservationParams = z.infer<
	typeof updateReservationParamsSchema
>;

export type MutationOptions = DefineMutationOptions<
	UpdateReservationParams,
	EaApiException,
	void
>;

export async function updateReservation(params: UpdateReservationParams) {
	const { reservationId, ...values } =
		updateReservationParamsSchema.parse(params);

	await eaApi.put(`/admin/reservations/${reservationId}`, values);
}

export const getUpdateReservationMutationKey = (reservationId?: string) =>
	reservationId
		? ["update-reservation", reservationId]
		: ["update-reservation"];

export function useUpdateReservation(options?: MutationOptions) {
	return useMutation({
		...options,
		mutationKey: options?.mutationKey ?? getUpdateReservationMutationKey(),
		mutationFn: updateReservation,
	});
}
