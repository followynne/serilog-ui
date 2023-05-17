import {
  TextInput,
  Button,
  Select,
  Grid,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useQuery } from '@tanstack/react-query';
import { useSearchFormContext } from '../../Hooks/SearchFormContext';
import useQueryLogsHook from '../../Hooks/useQueryLogsHook';
import { useEffect } from 'react';
import { fetchKeys } from '../../Queries/table-keys';
import { useAuthProperties } from '../../Hooks/useAuthProperties';

const Search = () => {
  const form = useSearchFormContext();
  const { authProps } = useAuthProperties();
  const queryTableKeys = useQuery({
    queryKey: ['get-keys'],
    queryFn: async () => { return await fetchKeys(authProps)},
    staleTime: Infinity,
    onSuccess: (data) =>{
      form.setFieldValue('table', data && data.length ? data.at(0) : '')},
    onError: (err) => console.error(err),
  });

  const { refetch } = useQueryLogsHook(form.values, 1);
  //  useQuery({
  //   queryKey: ['get-logs'], //form.values, 1],
  //   queryFn: () => fetchLogs(form.values, 1),
  //   keepPreviousData: true,
  //   enabled: false,
  //   retry: 1,
  //   // getNextPageParam: (ls, all) => {
  //   //   !!ls ? ls.currentPage : 1;
  //   // },
  //   onError: (err) => console.error(err), // TODO: notification box
  // });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
        refetch();
      })}
    >
      <Grid w="100%" justify="space-between" align="flex-end">
        <Grid.Col xs={6} sm={8} md={4} lg={3} orderSm={1} orderMd={1}>
          <Select
            label="Table"
            data={queryTableKeys.data?.map((d) => ({ value: d, label: d })) ?? []}
            {...form.getInputProps('table')}
          ></Select>
        </Grid.Col>
        <Grid.Col xs={6} sm={4} md={3} lg={3} orderSm={2} orderMd={4}>
          <Select
            label="Level"
            data={[
              {
                value: 'Verbose',
                label: 'Verbose',
              },
              {
                value: 'Debug',
                label: 'Debug',
              },
              {
                value: 'Information',
                label: 'Information',
              },
              {
                value: 'Warning',
                label: 'Warning',
              },
              {
                value: 'Error',
                label: 'Error',
              },
              {
                value: 'Fatal',
                label: 'Fatal',
              },
            ]}
            {...form.getInputProps('level')}
          ></Select>
        </Grid.Col>{' '}
        <Grid.Col xs={6} sm={6} md={4} lg={3} orderSm={3} orderMd={2}>
          <DateTimePicker
            label="Start date:"
            withSeconds={true}
            // maw={400}
            mx="auto"
            {...form.getInputProps('startDate')}
          />
        </Grid.Col>{' '}
        <Grid.Col xs={6} sm={6} md={4} lg={3} orderSm={4} orderMd={3}>
          <DateTimePicker
            label="End date:"
            withSeconds={true}
            // maw={400}
            mx="auto"
            {...form.getInputProps('endDate')}
          />
        </Grid.Col>{' '}
        <Grid.Col xs={6} sm={6} md={5} lg={3} orderSm={6} orderMd={6}>
          <TextInput
            withAsterisk
            label="Search"
            placeholder="Your input..."
            {...form.getInputProps('search')}
          />
        </Grid.Col>{' '}
        <Grid.Col xs={3} sm={3} md={2} lg={3} orderSm={5} orderMd={5}>
          <Select
            label="entries"
            data={[
              {
                value: 10,
                label: '10',
              },
              {
                value: 25,
                label: '25',
              },
              {
                value: 50,
                label: '50',
              },
              {
                value: 100,
                label: '100',
              },
            ]}
            {...form.getInputProps('entriesPerPage')}
          ></Select>
        </Grid.Col>
        <Grid.Col xs={3} sm={3} md={2} lg={3} orderSm={7}>
          <Button type="submit">Submit</Button>
        </Grid.Col>
      </Grid>
    </form>
  );
};

export default Search;
