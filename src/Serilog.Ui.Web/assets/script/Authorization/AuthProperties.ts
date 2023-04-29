import { AuthType } from '../../types/types.ts';

export class AuthProperties {
  authType?: AuthType;
  routePrefix?: string;
  private readonly _bearerToken: string | null;

  public get bearerToken() {
    return this._bearerToken ?? '' // sessionStorage.getItem('serilogui_token') ?? '';
  }

  public set bearerToken(bearerToken: string) {
    this.bearerToken = bearerToken;

    // sessionStorage.setItem('serilogui_token', bearerToken);
  }

  constructor() {
    // TODO: remove
    sessionStorage.clear();
    // TODO: remove

    let auth: string | undefined;
    ({ authType: auth, routePrefix: this.routePrefix } = window.config);
    this.authType = AuthType[auth ?? ''];
  }
}
