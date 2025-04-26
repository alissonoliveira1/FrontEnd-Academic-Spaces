import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import type { DefineMutationOptions } from "@/api/schemas.ts";
import { eaApi } from "@/lib/axios.ts";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createAcademicSpaceParamsSchema = z.object({
	name: z.string(),
	description: z.string(),
	capacity: z.number().int().positive(),
	acronym: z.string(),
});

export type CreateAcademicSpaceParams = z.infer<
	typeof createAcademicSpaceParamsSchema
>;

export async function createAcademicSpace(params: CreateAcademicSpaceParams) {
	await eaApi.post(
		"/admin/spaces",
		createAcademicSpaceParamsSchema.parse(params),
	);
}

export type UseCreateAcademicSpaceMutationOptions = DefineMutationOptions<
	CreateAcademicSpaceParams,
	EaApiException,
	void
>;

export const getCreateAcademicSpaceMutationKey = () => [
	"create-academic-space",
];

export function useCreateAcademicSpace(
	options?: UseCreateAcademicSpaceMutationOptions,
) {
	const mutationKey =
		options?.mutationKey ?? getCreateAcademicSpaceMutationKey();

	return useMutation({
		...options,
		mutationKey,
		mutationFn: createAcademicSpace,
	});
}
