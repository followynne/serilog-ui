import { Loader, Table } from '@mantine/core';
import useQueryLogsHook from '../../Hooks/useQueryLogsHook.tsx';
import { IsStringNullOrEmptyGuard, getBgLogLevel } from '../../util.ts';
import { LogLevel } from '../../../types/types.ts';
import DetailsModal from './DetailsModal.tsx';

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
            !IsStringNullOrEmptyGuard(data) &&
            data.logs.map((log) => (
              // TODO: all styles and modals
              <tr key={log.rowNo} className={log.level}>
                <td>{log.rowNo}</td>
                <td className={getBgLogLevel(LogLevel[log.level])}>
                  {log.level}
                </td>
                <td>{log.timestamp}</td>
                <td>{log.message}</td>
                <td>
                  {log.exception ? (
                    <DetailsModal modalContent={log.exception} />
                  ) : null}
                </td>
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
