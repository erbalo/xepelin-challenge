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

export enum ReportFrequency {
    DAYS = 'days',
    WEEKS = 'weeks',
    MONTHS = 'months',
}

export interface ReportOperation {
    quantity: number;
    frequency: ReportFrequency;
    fromDate: Date;
    toDate?: Date;
}

export interface ReportSummary {
    type: LedgerType;
    total_amount: number;
}
