import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import { eaApi } from "@/lib/axios.ts";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const creteSessionSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const createSessionResponseSchema = z.object({
	token: z.string(),
});

export type CreateSessionResponse = z.infer<typeof createSessionResponseSchema>;
export type CreateSessionRequest = z.infer<typeof creteSessionSchema>;

export type CreateSessionMutateOptions = UseMutationOptions<
	CreateSessionResponse,
	EaApiException,
	CreateSessionRequest
>;

export async function createSession(
	params: CreateSessionRequest,
): Promise<CreateSessionResponse> {
	const { signal } = new AbortController();

	const { data } = await eaApi.post<CreateSessionResponse>(
		"/auth/sign-in",
		{
			email: params.email,
			password: params.password,
		},
		{
			signal,
		},
	);

	return {
		token: data.token,
	};
}

export function useCreateSessionMutation(props?: CreateSessionMutateOptions) {
	return useMutation({
		...props,
		mutationFn: createSession,
		mutationKey: ["creat-session"],
	});
}
