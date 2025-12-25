import { getCookie } from "@/services/auth/tokenHandlers"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const serverFetchHelper = async (endPoint: string, options: RequestInit): Promise<Response> => {
    const accessToken = await getCookie("accessToken")
    const { headers, ...restOptions } = options

    const res = await fetch(`${BACKEND_URL}${endPoint}`, {
        ...restOptions,
        headers: {
            Cookie: accessToken ? `accessToken=${accessToken}` : "",
            ...headers,
        }
    })

    return res
}

export const serverFetch = {
    get: async (endPoint: string, options?: RequestInit): Promise<Response> => serverFetchHelper(endPoint, { ...options, method: "GET" }),
    post: async (endPoint: string, options?: RequestInit): Promise<Response> => serverFetchHelper(endPoint, { ...options, method: "POST" }),
    patch: async (endPoint: string, options?: RequestInit): Promise<Response> => serverFetchHelper(endPoint, { ...options, method: "PATCH" }),
    put: async (endPoint: string, options?: RequestInit): Promise<Response> => serverFetchHelper(endPoint, { ...options, method: "PUT" }),
    delete: async (endPoint: string, options?: RequestInit): Promise<Response> => serverFetchHelper(endPoint, { ...options, method: "DELETE" }),
}