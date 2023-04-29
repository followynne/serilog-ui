import {
  ActionIcon,
  Anchor,
  Badge,
  Group,
  NavLink,
  Navbar,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import AuthorizeButton from '../Authorization/AuthorizeButton.tsx';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Navbar
      // TODO: center all the buttons, correct bg to use dynamic mantine themes, improve all items
      hiddenBreakpoint="sm"
      hidden={!isOpen}
      width={{ sm: 70, md: 150, lg: 220 }}
      p="md"
      bg="blue"
    >
      <Navbar.Section mt="xs">
        <Group position="center" spacing="xs">
          <ActionIcon
            variant="default"
            onClick={() => {
              toggleColorScheme();
            }}
            size={30}
          >
            {colorScheme === 'dark' ? (
              <IconSun size="1rem" stroke="3" />
            ) : (
              <IconMoonStars size="1rem" stroke="3" />
            )}
          </ActionIcon>
        </Group>
      </Navbar.Section>
      <Navbar.Section grow mt="md">
        <Group>
          <NavLink
            label="Home"
            description="Home"
            icon={
              <Badge size="xs" variant="filled" color="red" w={16} h={16} p={0}>
                3
              </Badge>
            }
            sx={(theme) => ({
              display: 'block',
              width: '100%',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              },
            })}
          />
          <AuthorizeButton />
        </Group>
      </Navbar.Section>
      <Navbar.Section>
        <Group>
          <Anchor
            // TODO: hide on sm size or write alt, define sizes by page size
            href="https://github.com/serilog-contrib/serilog-ui"
            target="_blank"
          >
            <Badge size="sm">Serilog Ui | {new Date().getFullYear()}</Badge>
          </Anchor>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
