import { createContext, useContext, type ReactNode } from 'react';
import { useImmer } from 'use-immer';
import { AuthProperties } from '../Authorization/AuthProperties.ts';

interface AuthProps {
  authProps: AuthProperties;
  updateBearerToken: (bearerToken: string) => void;
}

const AuthPropertiesContext = createContext<AuthProps>({
  authProps: new AuthProperties(),
  updateBearerToken(_) {},
});

export const AuthPropertiesProvider = ({
  children,
}: {
  children: ReactNode | undefined;
}) => {
  const [authProps, setAuthProps] = useImmer(new AuthProperties());

  const setToken = (bearerToken: string) => {
    authProps.bearerToken = bearerToken;

    setAuthProps(authProps);
  };

  return (
    <AuthPropertiesContext.Provider value={{ authProps, updateBearerToken: setToken }}>
      {children}
    </AuthPropertiesContext.Provider>
  );
};

export const useAuthProperties = () => {
  const { authProps, updateBearerToken } = useContext(AuthPropertiesContext);
  return { authProps, updateBearerToken };
};
