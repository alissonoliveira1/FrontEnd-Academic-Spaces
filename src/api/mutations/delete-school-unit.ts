import type { DefineMutationOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const deleteSchoolUnitParamsSchema = z.object({
	id: z.string().uuid(),
});

export type DeleteSchoolUnitParams = z.infer<
	typeof deleteSchoolUnitParamsSchema
>;
export type MutationOptions = DefineMutationOptions<DeleteSchoolUnitParams>;

export async function deleteSchoolUnit(params: DeleteSchoolUnitParams) {
	const { id } = deleteSchoolUnitParamsSchema.parse(params);

	await eaApi.delete(`/school-units/${id}`);
}

export const getDeleteSchoolUnitMutationKey = (id?: string) =>
	id ? ["delete-school-unit", id] : ["delete-school-unit"];

export function useDeleteSchoolUnitMutation(options?: MutationOptions) {
	return useMutation({
		...options,
		mutationKey: options?.mutationKey ?? getDeleteSchoolUnitMutationKey(),
		mutationFn: deleteSchoolUnit,
	});
}
