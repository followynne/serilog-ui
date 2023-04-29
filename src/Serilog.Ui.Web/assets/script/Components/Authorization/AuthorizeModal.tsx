import { Group, Button, PasswordInput } from '@mantine/core';
import { useAuthProperties } from '../../Hooks/useAuthProperties.tsx';
import { useImmer } from 'use-immer';
import { type ChangeEvent, useEffect } from 'react';
import { NullGuardString } from '../../util.ts';

const AuthorizeModal = ({ close }: { close: () => void }) => {
  const { authProps, updateBearerToken } = useAuthProperties();

  const [token, setToken] = useImmer('');

  useEffect(() => {
    setToken(authProps.bearerToken);
  }, [authProps.bearerToken, setToken]);

  return (
    <form onSubmit={() => {}}>
      <PasswordInput
        placeholder="Bearer eyJhbGciOiJSUz..."
        label="JWT Token:"
        radius="md"
        size="md"
        value={token}
        disabled={authProps.bearerToken}
        withAsterisk={NullGuardString(authProps.bearerToken)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setToken(event.currentTarget.value);
        }}
      />

      <Group>
        <Button
          onClick={() => {
            updateBearerToken(token);
          }}
        >
          Save
        </Button>
        <Button onClick={close}>Close</Button>
      </Group>
    </form>
  );
};
export default AuthorizeModal;
