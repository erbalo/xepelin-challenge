import { Currency } from './currency.representation';

export enum LedgerType {
    INCOME = 'INCOME',
    OUTCOME = 'OUTCOME',
}

export interface LedgerOperation {
    businessId: number;
    invoiceId: number;
    amount: number;
    currency: Currency;
    type: LedgerType;
    paymentDate: Date;
}
