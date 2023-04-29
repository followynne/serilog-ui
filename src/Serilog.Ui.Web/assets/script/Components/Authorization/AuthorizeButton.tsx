import { Button, Modal } from '@mantine/core';
import { useAuthProperties } from '../../Hooks/useAuthProperties.tsx';
import { useDisclosure } from '@mantine/hooks';
import AuthorizeModal from './AuthorizeModal.tsx';

const AuthorizeButton = () => {
  const { authProps } = useAuthProperties();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button variant='light' onClick={open}>
        {authProps.bearerToken}
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title='JWT Authorizations'
        centered>
        <AuthorizeModal close={close} />
      </Modal>
    </>
  );
};

export default AuthorizeButton;
