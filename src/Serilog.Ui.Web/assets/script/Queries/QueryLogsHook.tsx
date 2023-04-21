import { useQuery } from '@tanstack/react-query';
import { SearchForm } from '../../types/types';
import { fetchLogs } from '../fetch';

const useQueryLogsHook = (v?: SearchForm, i?: number) =>
  useQuery({
    queryKey: ['get-logs'], //form.values, 1],
    queryFn: () => v && i ? fetchLogs(v, i) : null,
    keepPreviousData: true,
    enabled: false,
    retry: 1,
    // getNextPageParam: (ls, all) => {
    //   !!ls ? ls.currentPage : 1;
    // },
    onError: (err) => console.error(err), // TODO: notification box
  });

export default useQueryLogsHook;
