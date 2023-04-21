import { Header, MediaQuery, Burger, useMantineTheme } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';

const Head = ({
  isOpen,
  toggleOpen,
}: {
  isOpen: boolean;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const theme = useMantineTheme();
  return (
    <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
      <Header height={{ base: 50, sm:0 }} p='md' hiddenBreakpoint='md'>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Burger
            opened={isOpen}
            onClick={() => toggleOpen((o) => !o)}
            size='sm'
            color={theme.colors.gray[6]}
            mr='xl'
          />
        </div>
      </Header>
    </MediaQuery>
  );
};

export default Head;
