export interface ICredentials {
  email: string;
  password: string;
}

export interface IMerchant {
  id: string;
  name: string;
  merchantId: string;
  merchantCode: string;
  terminalId: string;
  address: string;
  active: boolean;
}

export interface ICreateUser extends ICredentials {
  firstName: string;
  lastName: string;
}

export interface IUser extends ICreateUser {
  id: string;
  active: boolean;
  merchantId: string;
}

export interface IClient {
  clientId: string;
  msisdn: string;
  active: boolean;
}

export interface IClient {
  clientId: string;
  msisdn: string;
  active: boolean;
}

export interface ITransaction {
  id: string;
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

export interface IPagination {
  page: number;
  pageSize: number;
}

export interface ICursor {
  cursor: string | null;
}
