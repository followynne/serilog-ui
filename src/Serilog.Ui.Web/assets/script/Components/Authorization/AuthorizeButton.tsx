import { Button, Modal } from '@mantine/core';
import { useAuthProperties } from '../../Hooks/useAuthProperties';
import { useDisclosure } from '@mantine/hooks';
import AuthorizeModal from './AuthorizeModal';
import { IconLockCheck, IconLockOpen } from '@tabler/icons-react';
import { IsStringNullOrEmptyGuard } from '../../util';

const AuthorizeButton = () => {
  const { authProps } = useAuthProperties();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button color='green' onClick={open}>
        {!IsStringNullOrEmptyGuard(authProps.bearerToken) ? (
          <IconLockCheck />
        ) : (
          <IconLockOpen />
        )}
        Authorize
      </Button>
      <Modal opened={opened} onClose={close} title="JWT Authorization" centered>
        <AuthorizeModal close={close} />
      </Modal>
    </>
  );
};

export default AuthorizeButton;
