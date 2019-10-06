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
}

export interface IAuthentication {
  token: string | null;
  error: string | null;
}
