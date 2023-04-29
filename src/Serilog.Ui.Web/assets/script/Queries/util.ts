import { AuthType } from '../../types/types.ts';
import { type AuthProperties } from '../Authorization/AuthProperties.ts';

export const determineHost = ['development', 'test'].includes(process.env.NODE_ENV ?? '')
  ? ''
  : location.pathname.replace('/index.html', '');

export const createAuthHeaders = (authProps: AuthProperties): RequestInit => {
  // TODO: review the whole token auth
  const headers: Headers = new Headers();

  const notWindowsAuth = authProps.authType !== AuthType.Windows;
  if (notWindowsAuth) headers.set('Authorization', authProps.bearerToken);
  const credentials = notWindowsAuth ? 'include' : 'same-origin';

  return { headers, credentials };
};
