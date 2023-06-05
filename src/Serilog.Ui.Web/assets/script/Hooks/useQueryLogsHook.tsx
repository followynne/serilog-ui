import { useQuery } from '@tanstack/react-query';
import { type SearchForm } from '../../types/types';
import { fetchLogs } from '../Queries/logs';
import { useAuthProperties } from './useAuthProperties';

const useQueryLogsHook = (v?: SearchForm, i?: number) =>{
  const { authProps } = useAuthProperties();

  return useQuery({
    queryKey: ['get-logs', authProps.bearerToken], // form.values, 1],
    queryFn: async () => (v && i ? await fetchLogs(v, i, authProps.bearerToken) : null),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    // enabled: false,
    retry: 1,
    // getNextPageParam: (ls, all) => {
    //   !!ls ? ls.currentPage : 1;
    // },
    onError: (err) => {
      console.error(err);
    }, // TODO: notification box
  });
}

  export default useQueryLogsHook;
