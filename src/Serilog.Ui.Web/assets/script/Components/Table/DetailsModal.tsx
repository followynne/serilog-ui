import { Button, Group, Modal, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Prism } from '@mantine/prism';

const DetailsModal = ({ modalContent }: { modalContent: string }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        radius="sm"
        size="xl"
        title="???"
        overlayProps={{
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Prism withLineNumbers trim={false} language="json">
          {/* // TODO Catch exception, pass directly json/xml from upper comp */}
          {JSON.stringify(JSON.parse(modalContent), null, 2)}
        </Prism>
      </Modal>

      <Group position="center">
        <Button onClick={open}>Click to view</Button>
      </Group>
    </>
  );
};

export default DetailsModal;
