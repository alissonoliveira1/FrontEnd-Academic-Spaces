import type { EaApiException } from "@/api/exeception/EaApiExeception.ts";
import type {
	UseMutationOptions,
	UseQueryOptions,
} from "@tanstack/react-query";
import { z } from "zod";

export const paginatedResponseSchema = z.object({
	totalOfPages: z.number().int(),
	pageSize: z.number().int(),
	page: z.number().int(),
	content: z.array(z.any()),
});
export const paginatedFiltersParamsSchema = z.object({
	page: z.number().int().default(1),
	pageSize: z.number().int().default(10),
});

// @ts-ignore
export interface DefineQueryOptions<QueryData, QueryError>
	extends UseQueryOptions<QueryData, QueryError> {
	queryKey?: string[] | readonly unknown[];
}

export interface DefineMutationOptions<
	MutationVariables,
	MutationError = EaApiException,
	MutationData = void,
> extends UseMutationOptions<MutationData, MutationError, MutationVariables> {
	mutationKey?: string[] | readonly unknown[];
}
