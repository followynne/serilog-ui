import { TextInput, Button, Group, Box, Select } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useQuery } from '@tanstack/react-query/build/lib/useQuery';
import { endOfTomorrow, startOfToday } from 'date-fns/esm';
import { fetchKeys } from '../../fetch';
import { useEffect } from 'react';

const Search = () => {
  const query = useQuery({
    queryKey: ['get-keys'],
    queryFn: fetchKeys,
    staleTime: 1000 * 60 * 30,
    onError: (err) => console.error(err),
  });

  const formInitialValues = {
    table: '',
    entriesPerPage: 10,
    level: 'Verbose',
    startDate: startOfToday(),
    endDate: endOfTomorrow(),
    search: '',
  };
  const form = useForm({
    initialValues: formInitialValues,
    validate: {},
  });

  //   useEffect(() => {
  // TODO set current table name value
  //       form.setValues({
  //         ...formInitialValues,
  //         table: query.data?.length && query.data.at(0),
  //       });
  //   }, []);

  return (
    <Box maw={300} mx='auto'>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Select
          label='Table'
          data={query.data?.map((d) => ({ value: d, label: d })) ?? []}
          {...form.getInputProps('table')}></Select>
        <Select
          label='Show entries'
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
          {...form.getInputProps('entriesPerPage')}></Select>
        <Select
          label='Level'
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
          {...form.getInputProps('level')}></Select>
        <DateTimePicker
          label='Start date:'
          withSeconds={true}
          // maw={400}
          mx='auto'
          {...form.getInputProps('startDate')}
        />
        <DateTimePicker
          label='End date:'
          withSeconds={true}
          // maw={400}
          mx='auto'
          {...form.getInputProps('endDate')}
        />
        <TextInput
          withAsterisk
          label='Search'
          placeholder='Your input...'
          {...form.getInputProps('search')}
        />
        <Group position='right' mt='md'>
          <Button type='submit'>Submit</Button>
        </Group>
      </form>
    </Box>
  );
};

export default Search;
