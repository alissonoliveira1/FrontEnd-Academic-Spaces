import type { DefineMutationOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const confirmReservationParamsSchema = z.object({
	reservationId: z.string().uuid(),
});

export type ConfirmReservationParams = z.infer<
	typeof confirmReservationParamsSchema
>;

export type MutationOptions = DefineMutationOptions<
	ConfirmReservationParams,
	void
>;

export async function confirmReservation(params: ConfirmReservationParams) {
	const { reservationId } = confirmReservationParamsSchema.parse(params);

	await eaApi.patch(`/reservations/${reservationId}/checkout`);
}

export const getConfirmReservationMutationKey = (
	params?: ConfirmReservationParams,
) => ["confirm-reservation", params];

export function useConfirmReservationMutation(options?: MutationOptions) {
	return useMutation({
		...options,
		mutationFn: confirmReservation,
		mutationKey: options?.mutationKey ?? getConfirmReservationMutationKey(),
	});
}
