import { Expose } from 'class-transformer';

export class Invoice {
    @Expose({ name: 'invoiceId' })
    id: number;

    @Expose({ name: 'issueDate' })
    issue_date: Date;

    @Expose({ name: 'paymentDate' })
    payment_date: Date;

    @Expose({ name: 'issuerId' })
    issuer_id: number;

    @Expose({ name: 'receiverId' })
    receiver_id: number;

    @Expose()
    amount: number;
}
