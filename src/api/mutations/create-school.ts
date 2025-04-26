import type { EaApiException } from "@/api/exeception/EaApiExeception.ts"
import { eaApi } from "@/lib/axios.ts"
import { type UseMutationOptions, useMutation } from "@tanstack/react-query"
import { z } from "zod"

export const createSchoolParamsSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2).max(2),
  contactNumber: z.string().min(9).max(11),
  type: z.enum(["PUBLICA", "PRIVADA"]),
})

export type CreateSchoolParams = z.infer<typeof createSchoolParamsSchema>

// Update the createSchool function to handle the response correctly
export async function createSchool(params: CreateSchoolParams) {
  try {
    const validatedParams = createSchoolParamsSchema.parse(params)
    const response = await eaApi.post("/school-units", validatedParams)

    // Log the response for debugging
    console.log("Create school response:", response.data)

    return response.data
  } catch (error) {
    console.error("Create school API error:", error)
    throw error
  }
}

export type UseCreateSchoolMutationOptions = UseMutationOptions<any, EaApiException, CreateSchoolParams>

export const getCreateSchoolMutationKey = () => ["create-school"]

export function useCreateSchoolMutation(options?: UseCreateSchoolMutationOptions) {
  const mutationKey = options?.mutationKey ?? getCreateSchoolMutationKey()

  return useMutation({
    mutationKey,
    ...options,
    mutationFn: createSchool,
  })
}
