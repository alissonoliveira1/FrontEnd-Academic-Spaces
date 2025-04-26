import type { EaApiException } from "@/api/exeception/EaApiExeception.ts"
import { eaApi } from "@/lib/axios.ts"
import { type UseQueryOptions, queryOptions, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { z } from "zod"

export const SchoolsSchema = z.object({
  name: z.string(),
  id: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  createdAt: z.string().transform((val) => new Date(val)),
})

export const getSchoolsSchemasResponse = z.object({
  content: z.array(SchoolsSchema),
  page: z.number(),
  pageSize: z.number(),
  totalOfPages: z.number(),
})

export const getSchoolsQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(10).default(10),
  search: z.string().optional(),
})

export type GetSchoolsResponse = z.infer<typeof getSchoolsSchemasResponse>
export type GetSchoolsQueryParams = z.infer<typeof getSchoolsQueryParamsSchema>
export type School = z.infer<typeof SchoolsSchema>

// Update the getSchools function to handle an array response
export async function getSchools(params: GetSchoolsQueryParams, signal?: AbortSignal): Promise<GetSchoolsResponse> {
  try {
    // Make the API call
    const { data } = await eaApi.get<School[]>("/school-units", {
      params: getSchoolsQueryParamsSchema.parse(params),
      signal,
    })

    // Log the raw response for debugging
    console.log("Schools API response:", data)

    // Check if the response is an array
    if (Array.isArray(data)) {
      // Convert the array to our expected paginated format
      const pageSize = params.pageSize || 10
      const page = params.page || 1
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize

      // Filter by search term if provided
      let filteredData = data
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredData = data.filter(
          (school) =>
            school.name.toLowerCase().includes(searchLower) ||
            school.city.toLowerCase().includes(searchLower) ||
            school.address.toLowerCase().includes(searchLower),
        )
      }

      // Paginate the data
      const paginatedData = filteredData.slice(startIndex, endIndex)

      // Create a paginated response object
      const response: GetSchoolsResponse = {
        content: paginatedData,
        page: page,
        pageSize: pageSize,
        totalOfPages: Math.ceil(filteredData.length / pageSize),
      }

      return response
    }

    // If it's not an array, try to parse it as our expected format
    return getSchoolsSchemasResponse.parse(data)
  } catch (error) {
    // Don't log canceled requests as errors
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message)
      throw error
    }

    // Log more details about the error
    if (axios.isAxiosError(error)) {
      console.error("Error fetching schools - Status:", error.response?.status)
      console.error("Error details:", error.response?.data)
    }

    console.error("Error fetching schools:", error)
    throw error
  }
}

export type UseGetSchoolsQueryOptions = UseQueryOptions<GetSchoolsResponse, EaApiException>

export const getSchoolsQueryKey = (params: GetSchoolsQueryParams) => ["schools", params]

export const getSchoolsQueryOptions = (params: GetSchoolsQueryParams, options?: UseGetSchoolsQueryOptions) => {
  return queryOptions({
    ...options,
    queryKey: getSchoolsQueryKey(params),
    queryFn: ({ signal }) => getSchools(params, signal),
    retry: (failureCount, error) => {
      // Don't retry canceled requests
      if (axios.isCancel(error)) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useGetSchoolsQuery(params: GetSchoolsQueryParams, options?: UseGetSchoolsQueryOptions) {
  return useQuery({
    ...options,
    queryFn: ({ signal }) => getSchools(params, signal),
    queryKey: getSchoolsQueryKey(params),
    retry: (failureCount, error) => {
      // Don't retry canceled requests
      if (axios.isCancel(error)) {
        return false
      }
      return failureCount < 3
    },
  })
}
