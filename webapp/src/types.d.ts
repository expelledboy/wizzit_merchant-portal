export interface ICredentials {
  email: string;
  password: string;
}

export interface IRegisterMerchantUser extends ICredentials {
  firstName: string;
  lastName: string;
}

export interface IMerchantUser extends IRegisterMerchantUser {
  id: string;
  active: boolean;
  editting: boolean;
}

export interface IAuthentication {
  token: string | null;
  error: string | null;
}
