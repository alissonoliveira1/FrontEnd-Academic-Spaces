import type { EaApiException } from "@/api/exeception/EaApiExeception.ts"
import { eaApi } from "@/lib/axios.ts"
import { type UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query"
import { z } from "zod"

export const TeacherSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string(),
  // Add course field as optional
  course: z.string().optional(),
  contactNumber: z.string().optional(),
  // Make createdAt optional and provide a default value
  createdAt: z
    .string()
    .transform((val) => new Date(val))
    .optional()
    .default(() => new Date().toISOString()),
})

// Define a schema for the array response
export const teachersArraySchema = z.array(TeacherSchema)

// Keep the paginated schema for our internal use
export const getSchoolTeachersResponseSchema = z.object({
  content: z.array(TeacherSchema),
  page: z.number(),
  pageSize: z.number(),
  totalOfPages: z.number(),
})

export const getSchoolTeachersParamsSchema = z.object({
  schoolId: z.string().uuid(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(10).default(10),
})

export type GetSchoolTeachersResponse = z.infer<typeof getSchoolTeachersResponseSchema>
export type GetSchoolTeachersParams = z.infer<typeof getSchoolTeachersParamsSchema>
export type SchoolTeacher = z.infer<typeof TeacherSchema>

export async function getSchoolTeachers(
  params: GetSchoolTeachersParams,
  signal?: AbortSignal,
): Promise<GetSchoolTeachersResponse> {
  const { schoolId, page, pageSize } = params

  try {
    console.log(`Fetching teachers for school ${schoolId}`)

    // Get all teachers for the school
    const { data } = await eaApi.get(`/school-units/${schoolId}/teachers`, {
      signal,
    })

    console.log(`Received teachers data for school ${schoolId}:`, data)

    // Parse the array response
    const teachers = teachersArraySchema.parse(data)

    // Implement client-side pagination
    const totalTeachers = teachers.length
    const totalPages = Math.ceil(totalTeachers / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalTeachers)
    const paginatedTeachers = teachers.slice(startIndex, endIndex)

    // Return in our expected format
    return {
      content: paginatedTeachers,
      page,
      pageSize,
      totalOfPages: totalPages,
    }
  } catch (error) {
    console.error(`Error fetching teachers for school ${schoolId}:`, error)
    throw error
  }
}

export type UseGetSchoolTeachersQueryOptions = UseQueryOptions<GetSchoolTeachersResponse, EaApiException>

export const getSchoolTeachersQueryKey = (params: GetSchoolTeachersParams) => ["school-teachers", params]

export const getSchoolTeachersQueryOptions = (
  params: GetSchoolTeachersParams,
  options?: UseGetSchoolTeachersQueryOptions,
) => {
  return queryOptions({
    ...options,
    queryKey: getSchoolTeachersQueryKey(params),
    queryFn: ({ signal }) => getSchoolTeachers(params, signal),
  })
}

export function useGetSchoolTeachers(params: GetSchoolTeachersParams, options?: UseGetSchoolTeachersQueryOptions) {
  return useQuery({
    ...options,
    queryFn: ({ signal }) => getSchoolTeachers(params, signal),
    queryKey: options?.queryKey || getSchoolTeachersQueryKey(params),
    enabled: !!params.schoolId,
  })
}
