import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Base API URL for NestJS backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get JWT token from localStorage
function getToken(): string | null {
  return localStorage.getItem('access_token');
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const token = getToken();
  const headers: HeadersInit = data ? { "Content-Type": "application/json" } : {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Convert relative URLs to absolute URLs pointing to NestJS backend
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.replace('/api', '')}`;

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Convert query key to full URL
    const path = queryKey.join("/");
    const fullUrl = path.startsWith('http') ? path : `${API_BASE_URL}${path.replace('/api', '')}`;

    const res = await fetch(fullUrl, {
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      gcTime: Infinity, // Previously cacheTime
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
