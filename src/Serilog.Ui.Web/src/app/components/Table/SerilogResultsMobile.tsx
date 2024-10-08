import {
  Blockquote,
  Box,
  Card,
  Group,
  LoadingOverlay,
  SimpleGrid,
  Skeleton,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconSearchOff } from '@tabler/icons-react';
import { useException } from 'app/hooks/useException';
import useQueryLogs from 'app/hooks/useQueryLogs';
import { useSerilogUiProps } from 'app/hooks/useSerilogUiProps';
import { getBgLogLevel, printDate } from 'app/util/prettyPrints';
import { Suspense, lazy, memo } from 'react';
import classes from 'style/table.module.css';
import { EncodedSeriLogObject, LogLevel } from 'types/types';

const DetailsModal = lazy(() => import('./DetailsModal'));
const PropertiesModal = lazy(() => import('./PropertiesModal'));

const SerilogResultsMobile = () => {
  const { data, isFetching } = useQueryLogs();

  const { isUtc } = useSerilogUiProps();

  return (
    <SimpleGrid
      w="100%"
      cols={{ base: 1, sm: 2 }}
      spacing="xs"
      verticalSpacing="sm"
      p="0.8em"
    >
      <LoadingOverlay
        visible={isFetching}
        zIndex={200}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      {isFetching && <MobileSkeleton />}
      {!data?.logs.length ? (
        <Blockquote mt="lg" ml="lg" icon={<IconSearchOff />}>
          No results.
        </Blockquote>
      ) : null}
      {data?.logs.length
        ? data.logs.map((log) => <LogCard key={log.rowNo} isUtc={isUtc} log={log} />)
        : null}
    </SimpleGrid>
  );
};

const MobileSkeleton = () => {
  const theme = useMantineTheme();
  return [...Array(4).keys()].map((value) => (
    <Skeleton
      h="14em"
      key={value}
      radius="none"
      mb="sm"
      style={{ border: `0.1em dashed ${theme.colors.gray[7]}` }}
    />
  ));
};

const LogCard = memo(({ log, isUtc }: { log: EncodedSeriLogObject; isUtc?: boolean }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const colorByLogLevel = getBgLogLevel(theme, colorScheme, LogLevel[log.level]);

  return (
    <Card key={log.rowNo} shadow="xs" padding="0" radius="sm" withBorder mih="14em">
      <Card.Section
        withBorder
        className={classes.mobileCardHeaderWrapper}
        style={{ backgroundColor: colorByLogLevel }}
      >
        <Box className={classes.mobileCardHeaderText}>
          <Text size="md" fw={700} c={theme.colors.dark[8]} truncate="end" ta="center">
            {log.rowNo}
          </Text>
          <Text size="sm" fs="italic" c={theme.colors.dark[6]} ta="center">
            {log.level}
          </Text>
          <Text size="xs" c={theme.colors.dark[6]} ta="center">
            {printDate(log.timestamp, isUtc)}
          </Text>
        </Box>
      </Card.Section>

      <Group p="0.8em">
        <Text ta="justify" fz="sm" lh="sm" style={{ letterSpacing: '0.002em' }}>
          {log.message}
        </Text>
      </Group>
      <Card.Section
        p="0.8em"
        display="grid"
        w="80%"
        fz="xs"
        m="auto auto 0.5em"
        style={{
          gap: '0.3em',
          gridTemplateColumns: 'auto auto',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <ExceptionCard log={log} />
        <Suspense>
          <PropertiesModal fullScreen modalContent={log} />
        </Suspense>
      </Card.Section>
    </Card>
  );
});

const ExceptionCard = memo(({ log }: { log: EncodedSeriLogObject }) => {
  const { exceptionContent, logType, removeException } = useException(
    log.exception,
    log.propertyType,
  );

  if (removeException) return null;

  return (
    <Suspense>
      <DetailsModal
        modalContent={exceptionContent ?? ''}
        modalTitle="Exception details"
        buttonTitle="exception"
        contentType={logType}
        disabled={!exceptionContent}
        fullScreen
      />
    </Suspense>
  );
});

export default SerilogResultsMobile;
