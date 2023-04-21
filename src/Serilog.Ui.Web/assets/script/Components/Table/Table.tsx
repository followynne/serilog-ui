import { Loader, Table } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import useQueryLogsHook from '../../Queries/QueryLogsHook';
import { getBgLogLevel } from '../../util';
import { LogLevel } from '../../../types/types';

const SerilogResults = () => {
  const { data, isFetching } = useQueryLogsHook();

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>#</th>
            <th>Level</th>
            <th>Date</th>
            <th>Message</th>
            <th>Exception</th>
            <th>Property type</th>
            <th>Properties</th>
          </tr>
        </thead>
        <tbody>
          {!isFetching &&
            data &&
            data.logs.map((log) => (
              // TODO: all styles and modals
              <tr className={log.level}>
                <td>{log.rowNo}</td>
                <td className={getBgLogLevel(LogLevel[log.level])}>
                  {log.level}
                </td>
                <td>{log.timestamp}</td>
                <td>{log.message}</td>
                <td>{false ? log.exception : ''}</td>
                <td>{log.propertyType}</td>
                <td>{false ? log.properties : ''}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      {isFetching && <Loader variant='bars' />}
    </div>
  );
};

export default SerilogResults;
