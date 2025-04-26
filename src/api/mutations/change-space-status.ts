import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { eaApi } from "@/lib/axios.ts";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const changeSpaceStatusParamsSchema = z.object({
	id: z.string(),
	status: z.enum(["UNAVAILABLE", "AVAILABLE"]),
});

export type ChangeSpaceStatusParams = z.infer<
	typeof changeSpaceStatusParamsSchema
>;

export type ChangeSpaceStatusMutationOptions = UseMutationOptions<
	void,
	EaApiException,
	ChangeSpaceStatusParams
>;

export async function changeSpaceStatus(params: ChangeSpaceStatusParams) {
	await eaApi.patch(`/admin/spaces/${params.id}/status`, {
		status: params.status,
	});
}

export const getChangeSpaceStatusMutationKey = (id: string) => [
	"change-space-status",
	id,
];

export function useChangeSpaceStatus(
	options?: ChangeSpaceStatusMutationOptions,
) {
	return useMutation({
		...options,
		mutationKey: options?.mutationKey ?? getChangeSpaceStatusMutationKey(""),
		mutationFn: changeSpaceStatus,
	});
}
