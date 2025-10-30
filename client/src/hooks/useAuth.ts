import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User & { profile?: any }>({
    queryKey: ["/api/users/me"],
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    enabled: !!localStorage.getItem('access_token'), // Only fetch if token exists
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
