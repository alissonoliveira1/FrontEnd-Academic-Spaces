import { eaApi } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import type { EaApiException } from "../exeception/EaApiExeception";
import type { DefineMutationOptions } from "../schemas";

export const updateAcademicSpaceParamsSchema = z.object({
  id: z.string(),
  data: z.object({
    name: z.string().nonempty(),
    description: z.string().nonempty(),
    capacity: z.number().int().positive(),
    acronym: z.coerce.string(),
  }),
});

export type UpdateAcademicSpaceParams = z.infer<typeof updateAcademicSpaceParamsSchema>;
export type UpdateAcademicSpaceMutationOptions = DefineMutationOptions<UpdateAcademicSpaceParams, EaApiException>;

export async function updateAcademicSpace(params: UpdateAcademicSpaceParams) {
  await eaApi.put(`/admin/spaces/${params.id}`, params.data);
}

export const getUpdateAcademicSpaceMutationKey = (id: string) => ["update-academic-space", id];

export function useUpdateAcademicSpace(options?: UpdateAcademicSpaceMutationOptions) {
  return useMutation({
    ...options,
    mutationKey: options?.mutationKey ?? getUpdateAcademicSpaceMutationKey(""),
    mutationFn: updateAcademicSpace,
  });
}
