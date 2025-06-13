
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviciosApi } from "@/api/serviciosApi";
import { useSafeHook } from "@/hooks/useSafeHooks";

export const useSafeServicios = () => {
  return useSafeHook(
    () => useQuery({
      queryKey: ['servicios'],
      queryFn: serviciosApi.getAll
    }),
    { 
      data: [], 
      isLoading: false, 
      error: null,
      isError: false,
      isPending: false,
      isSuccess: false,
      status: 'pending' as const,
      fetchStatus: 'idle' as const,
      refetch: async () => ({ data: [], isLoading: false, error: null, isError: false, isPending: false, isSuccess: false, status: 'pending' as const, fetchStatus: 'idle' as const }),
      isRefetching: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isLoadingError: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: true
    }
  );
};

export const useSafeUpdateServicio = () => {
  return useSafeHook(
    () => {
      const queryClient = useQueryClient();
      
      return useMutation({
        mutationFn: serviciosApi.update,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['servicios'] });
          queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
        }
      });
    },
    { 
      mutate: () => {},
      mutateAsync: async () => undefined as any,
      isPending: false,
      isError: false,
      isSuccess: false,
      isIdle: true,
      status: 'idle' as const,
      data: undefined,
      error: null,
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      reset: () => {},
      submittedAt: 0
    }
  );
};

export const useSafeDeleteServicio = () => {
  return useSafeHook(
    () => {
      const queryClient = useQueryClient();
      
      return useMutation({
        mutationFn: serviciosApi.delete,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['servicios'] });
          queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
        }
      });
    },
    { 
      mutate: () => {},
      mutateAsync: async () => undefined as any,
      isPending: false,
      isError: false,
      isSuccess: false,
      isIdle: true,
      status: 'idle' as const,
      data: undefined,
      error: null,
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      reset: () => {},
      submittedAt: 0
    }
  );
};

export const useSafeEstadisticasServicios = () => {
  return useSafeHook(
    () => useQuery({
      queryKey: ['estadisticas-servicios'],
      queryFn: serviciosApi.getEstadisticas
    }),
    { 
      data: null, 
      isLoading: false, 
      error: null,
      isError: false,
      isPending: false,
      isSuccess: false,
      status: 'pending' as const,
      fetchStatus: 'idle' as const,
      refetch: async () => ({ data: null, isLoading: false, error: null, isError: false, isPending: false, isSuccess: false, status: 'pending' as const, fetchStatus: 'idle' as const }),
      isRefetching: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isLoadingError: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetchError: false,
      isStale: true
    }
  );
};
