import { Expose } from 'class-transformer';

export class Invoice {
    @Expose({ name: 'invoice_id' })
    id: number;

    @Expose({ name: 'issue_date' })
    issueDate: Date;

    @Expose({ name: 'payment_date' })
    paymentDate: Date;

    @Expose({ name: 'issuer_id' })
    issuerId: number;

    @Expose({ name: 'receiver_id' })
    receiverId: number;

    @Expose()
    amount: number;
}
