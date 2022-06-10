import { singleton } from 'tsyringe';
import { Mapper } from '../../commons';
import { Invoice } from '../representations/invoice';
import InvoiceEntity from '../entities/invoice.entity';

@singleton()
class InvoiceMapper extends Mapper<Invoice, InvoiceEntity> {
    fromDto(invoice: Invoice): InvoiceEntity {
        const entity = new InvoiceEntity();
        entity.id = invoice.id;
        entity.amount = invoice.amount;
        entity.issue_date = invoice.issue_date;
        entity.payment_date = invoice.payment_date;
        entity.issuer_id = invoice.issuer_id;
        entity.receiver_id = invoice.receiver_id;

        return entity;
    }

    fromEntity(entity: InvoiceEntity): Invoice {
        const invoice = new Invoice();
        invoice.id = entity.id;
        invoice.amount = entity.amount;
        invoice.issue_date = entity.issue_date;
        invoice.payment_date = entity.payment_date;
        invoice.issuer_id = entity.issuer_id;
        invoice.receiver_id = entity.receiver_id;

        return invoice;
    }
}

export default InvoiceMapper;
