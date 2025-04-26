import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { eaApi } from "@/lib/axios.ts";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const updateUserParamsSchema = z.object({
	id: z.string(),
	email: z.string().email().optional(),
	name: z.string().optional(),
	role: z.string().optional(),
});

export type UpdateUserParams = z.infer<typeof updateUserParamsSchema>;

export type UpdateUserMutationOptions = UseMutationOptions<
	void,
	EaApiException,
	UpdateUserParams
>;

export const getUserUpdateMutationKey = (id: string) => ["update-user", id];

export async function updateUser(params: UpdateUserParams) {
	await eaApi.put(`/admin/users/${params.id}`, params);
}

export function useUpdateUserMutation(options?: UpdateUserMutationOptions) {
	return useMutation({
		...options,
		mutationKey: options?.mutationKey ?? getUserUpdateMutationKey(""),
		mutationFn: updateUser,
	});
}
