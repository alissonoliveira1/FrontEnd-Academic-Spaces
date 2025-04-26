import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { eaApi } from "@/lib/axios.ts";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createBaseUserSchema = z.object({
	email: z.string().email(),
	contactNumber: z.string().min(9).max(11),
	password: z.string().min(1),
	name: z.string().min(2),
	role: z.enum(["TEACHER", "ADMIN"]),
});

export const createAdminSchema = createBaseUserSchema.extend({
	role: z.literal("ADMIN"),
});

export const createTeacherSchema = createBaseUserSchema.extend({
	schoolUnitId: z.string().min(1),
	course: z.string().min(5),
	role: z.literal("TEACHER"),
});

export const createUserParamsSchema = z.discriminatedUnion("role", [
	createAdminSchema,
	createTeacherSchema,
]);

export type CreateUserParams = z.infer<typeof createUserParamsSchema>;

export async function createUser(params: CreateUserParams) {
	await eaApi.post("/admin/users", createUserParamsSchema.parse(params));
}

export type UseCreateUserMutationOptions = UseMutationOptions<
	void,
	EaApiException,
	CreateUserParams
>;

export function useCreateUserMutation(options?: UseCreateUserMutationOptions) {
	const mutationKey = options?.mutationKey ?? ["create-user"];

	return useMutation({
		mutationKey,
		...options,
		mutationFn: createUser,
	});
}
