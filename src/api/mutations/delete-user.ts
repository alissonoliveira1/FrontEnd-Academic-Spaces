import type { DefineMutationOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const deleteUsersParamsSchema = z.object({
	id: z.string().uuid(),
});

export type DeleteUsersParams = z.infer<typeof deleteUsersParamsSchema>;

export type MutationOptions = DefineMutationOptions<DeleteUsersParams>;

export async function deleteUser(params: DeleteUsersParams) {
	const { id } = deleteUsersParamsSchema.parse(params);

	await eaApi.delete(`/admin/users/${id}`);
}

export const getDeleteUserMutationKey = (id?: string) =>
	id ? ["delete-user", id] : ["delete-user"];

export function useDeleteUserMutation(options?: MutationOptions) {
	return useMutation({
		...options,
		mutationKey: options?.mutationKey ?? getDeleteUserMutationKey(),
		mutationFn: deleteUser,
	});
}
