import { useQuery } from '@tanstack/react-query';
import { type SearchForm } from '../../types/types';
import { fetchLogs } from '../Queries/logs';
import { useAuthProperties } from './useAuthProperties';
import { useSearchFormContext } from './SearchFormContext';

const useQueryLogsHook = () =>{
  const { authProps } = useAuthProperties();
  const form = useSearchFormContext();

  return useQuery({
    queryKey: ['get-logs', authProps.bearerToken, form.values], // form.values, 1],
    queryFn: async () => (form.values ? await fetchLogs(form.values, authProps.bearerToken) : null),
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
