import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import type { DefineMutationOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const cancelReservationParamsSchema = z.object({
	reservationId: z.string().uuid(),
});

export type CancelReservationParams = z.infer<
	typeof cancelReservationParamsSchema
>;

export async function cancelReservation(
	params: CancelReservationParams,
): Promise<void> {
	const { reservationId } = cancelReservationParamsSchema.parse(params);

	await eaApi.patch(`/admin/reservations/${reservationId}/cancel`);
}

export type UseCancelReservationMutationOptions = DefineMutationOptions<
	CancelReservationParams,
	EaApiException,
	void
>;

export const getCancelReservationMutationKey = (reservationId?: string) =>
	reservationId
		? ["cancel-reservation", reservationId]
		: ["cancel-reservation"];

export function useCancelReservationMutation(
	options?: UseCancelReservationMutationOptions,
) {
	return useMutation({
		...options,
		mutationFn: cancelReservation,
		mutationKey: options?.mutationKey ?? getCancelReservationMutationKey(),
	});
}
