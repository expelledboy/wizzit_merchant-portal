import { InvoiceFreq } from "../types/invoice-freq.type";

export const SET_QUOTE_PARAMS = "SET_QUOTE_PARAMS";
export const SET_INVOICE_FREQ = "SET_INVOICE_FREQ";

type SetQuoteParams = {
  type: typeof SET_QUOTE_PARAMS;
  payload: { age: number; carBrand: string; carPurchasePrice: number };
};

type SetInvoiceFreq = {
  type: typeof SET_INVOICE_FREQ;
  payload: { invoiceFreq: InvoiceFreq };
};

export function setQuoteParams(params: {
  age: number;
  carBrand: string;
  carPurchasePrice: number;
}): Action {
  const { age, carBrand, carPurchasePrice } = params;
  return {
    type: SET_QUOTE_PARAMS,
    payload: { age, carBrand, carPurchasePrice }
  };
}

export function setInvoiceFreq(invoiceFreq: InvoiceFreq): Action {
  return {
    type: SET_INVOICE_FREQ,
    payload: { invoiceFreq }
  };
}

export type Action = SetQuoteParams | SetInvoiceFreq;
