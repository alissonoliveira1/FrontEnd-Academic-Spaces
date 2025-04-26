import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import type { DefineMutationOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createReservationParamsSchema = z.object({
	academicSpaceId: z.string().uuid(),
	startDateTime: z.string(),
	endDateTime: z.string(),
});

export type CreateReservationParams = z.infer<
	typeof createReservationParamsSchema
>;

export type CreateReservationMutationOptions = DefineMutationOptions<
	CreateReservationParams,
	EaApiException
>;

export async function createReservation(params: CreateReservationParams) {
	await eaApi.post(
		"/reservations",
		createReservationParamsSchema.parse(params),
	);
}

export const getCreateReservationMutationQueryKey = () => [
	"create-reservation",
];

export function useCreateReservation(
	options?: CreateReservationMutationOptions,
) {
	return useMutation({
		...options,
		mutationKey: options?.mutationKey ?? getCreateReservationMutationQueryKey(),
		mutationFn: createReservation,
	});
}
