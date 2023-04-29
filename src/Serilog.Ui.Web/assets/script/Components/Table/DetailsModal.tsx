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
        title='Authentication'
        overlayProps={{
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}>
        <Prism withLineNumbers language='json'>{modalContent}</Prism>
      </Modal>

      <Group position='center'>
        <Button onClick={open}>open</Button>
      </Group>
    </>
  );
};

export default DetailsModal;
