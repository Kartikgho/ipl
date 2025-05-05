import { queryClient, apiRequest } from "./queryClient";

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export const apiClient = {
  /**
   * Make a GET request to the API
   * @param url - The URL to make the request to
   */
  get: async <T = any>(url: string): Promise<T> => {
    const res = await apiRequest("GET", url);
    return await res.json();
  },

  /**
   * Make a POST request to the API
   * @param url - The URL to make the request to
   * @param data - The data to send in the request body
   */
  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const res = await apiRequest("POST", url, data);
    return await res.json();
  },

  /**
   * Make a PUT request to the API
   * @param url - The URL to make the request to
   * @param data - The data to send in the request body
   */
  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const res = await apiRequest("PUT", url, data);
    return await res.json();
  },

  /**
   * Make a DELETE request to the API
   * @param url - The URL to make the request to
   */
  delete: async <T = any>(url: string): Promise<T> => {
    const res = await apiRequest("DELETE", url);
    return await res.json();
  },

  /**
   * Invalidate a query to refetch data
   * @param queryKey - The key of the query to invalidate
   */
  invalidateQuery: (queryKey: string | string[]) => {
    const key = Array.isArray(queryKey) ? queryKey : [queryKey];
    return queryClient.invalidateQueries({ queryKey: key });
  }
};
