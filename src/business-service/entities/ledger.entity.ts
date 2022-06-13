import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LedgerType } from '../representations/business.balance.representation';
import { Currency } from '../representations/currency.representation';

@Entity({ name: 'ledgers' })
class LedgerEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'business_id' })
    businessId: number;

    @Column({ name: 'invoice_id' })
    invoiceId: number;

    @Column({
        type: 'money',
    })
    amount: number;

    @Column({
        type: 'enum',
        enum: Currency,
    })
    currency: Currency;

    @Column({
        type: 'enum',
        enum: LedgerType,
    })
    type: LedgerType;

    @Column({
        name: 'payment_date',
        type: 'date',
    })
    paymentDate: Date;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
    })
    updatedAt: Date;
}

export default LedgerEntity;
