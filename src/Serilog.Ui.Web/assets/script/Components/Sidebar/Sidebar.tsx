import {
  ActionIcon,
  Badge,
  Group,
  NavLink,
  Navbar,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';

const Sidebar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <Navbar width={{ sm: 150 }} p='xs' bg='blue'>
      <Navbar.Section mt='xs'>
        <Group>
          <NavLink
            label='LU'
            active={false}
            icon={
              <ActionIcon
                variant='default'
                onClick={() => toggleColorScheme()}
                size={30}>
                {colorScheme === 'dark' ? (
                  <IconSun size='1rem' />
                ) : (
                  <IconMoonStars size='1rem' />
                )}
              </ActionIcon>
            }
          />
        </Group>
      </Navbar.Section>
      <Navbar.Section grow mt='md'>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}>
          <Group>
            <NavLink
              label='Home'
              description='Home'
              icon={
                <Badge
                  size='xs'
                  variant='filled'
                  color='red'
                  w={16}
                  h={16}
                  p={0}>
                  3
                </Badge>
              }
            />
          </Group>
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section>
        <Group>
          <Badge>Serilog Ui | {new Date().getFullYear()}</Badge>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
