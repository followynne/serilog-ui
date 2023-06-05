import { Pagination } from '@mantine/core';
import useQueryLogsHook from '../../Hooks/useQueryLogsHook';
import { useSearchFormContext } from '../../Hooks/SearchFormContext';

const Paging = () => {
  const { data, isFetching } = useQueryLogsHook();
  const form = useSearchFormContext();
  // TODO Object guard
  if (isFetching || !data) return null;
  const totalPages = Math.ceil(data.total / data.count);

  return <Pagination position='right' withEdges total={totalPages} siblings={3} {...form.getInputProps('page')} />;
};

export default Paging;
