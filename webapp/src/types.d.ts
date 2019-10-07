export interface ICredentials {
  email: string;
  password: string;
}

export interface IMerchant {
  merchantId: string;
  name: string;
  merchantCode: string;
  terminalId: string;
  address: string;
  active: boolean;
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

export interface IUser {
  userId: string;
  msisdn: string;
  active: boolean;
}

export interface ITransaction {
  userId: string;
  msisdn: string;
  active: boolean;
}

export interface ITransaction {
  uuid: string;
  rrn: string;
  stan: string;
  datetime: Date;
  type: string;
  amt: number;
  respCode: string;
  authCode: string;
}

export interface IAuthentication {
  token: string | null;
  error: string | null;
}
