export type Merchant = {
  id: number;
  merchant_id: string;
  password: string;
  name: string;
  merchant_code: string;
  terminal_id: string;
  address: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type MerchantUser = {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  merchant_id: number;
  role: "admin" | "merchant_user";
  active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type User = {
  user_id: string;
  msisdn: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type Card = {
  id: number;
  card_number: string;
  user_id: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
};
