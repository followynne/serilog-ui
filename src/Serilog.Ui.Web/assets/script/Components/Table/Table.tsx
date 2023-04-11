import { Table } from '@mantine/core';

const SerilogResults = () => {
  return (
    <Table>
        {/* https://tanstack.com/query/latest/docs/react/guides/queries */}
      <thead>
        <tr>
          <th>#</th>
          <th>Level</th>
          <th>Date</th>
          <th>Message</th>
          <th>Exception</th>
          <th>Properties</th>
        </tr>
      </thead>
      <tbody></tbody>
    </Table>
  );
};

export default SerilogResults;
