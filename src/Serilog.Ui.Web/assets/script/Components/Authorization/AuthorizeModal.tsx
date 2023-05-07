import { Group, Button, PasswordInput } from '@mantine/core';
import { useAuthProperties } from '../../Hooks/useAuthProperties.tsx';
import { useImmer } from 'use-immer';
import { type ChangeEvent, useEffect } from 'react';
import { IsStringNullOrEmptyGuard } from '../../util.ts';

const AuthorizeModal = ({ close }: { close: () => void }) => {
  const { authProps, updateBearerToken } = useAuthProperties();
  const [token, setToken] = useImmer(authProps.bearerToken);

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
        disabled={!IsStringNullOrEmptyGuard(authProps.bearerToken)}
        withAsterisk
        autoComplete="off"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          authProps.validateToken(event.currentTarget.value);
          setToken(event.currentTarget.value);
        }}
      />

      <Group
        display={IsStringNullOrEmptyGuard(authProps.bearerToken) ? 'inherit' : 'none'}
      >
        <Button
          onClick={() => {
            updateBearerToken(token);
          }}
        >
          Save
        </Button>
        <Button onClick={close}>Close</Button>
      </Group>
      <Group
        display={!IsStringNullOrEmptyGuard(authProps.bearerToken) ? 'inherit' : 'none'}
      >
        <Button
          onClick={() => {
            updateBearerToken('');
          }}
        >
          Change Token
        </Button>
      </Group>
    </form>
  );
};
export default AuthorizeModal;
