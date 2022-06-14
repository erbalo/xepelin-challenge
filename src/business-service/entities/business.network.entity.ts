import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'business_networks' })
class BusinessNetworkEntity {
    @PrimaryColumn({ name: 'business_id' })
    businessId: number;

    @PrimaryColumn({ name: 'business_relation_id' })
    businessRelationId: number;

    @PrimaryColumn({ name: 'reporting_date', type: 'date' })
    reportingDate: Date;

    @Column({ name: 'issued_invoices', type: 'bigint' })
    issuedInvoices: number;

    @Column({ name: 'received_invoices', type: 'bigint' })
    receivedInvoices: number;

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

export default BusinessNetworkEntity;
