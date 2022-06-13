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
        entity.issueDate = invoice.issueDate;
        entity.paymentDate = invoice.paymentDate;
        entity.issuerId = invoice.issuerId;
        entity.receiverId = invoice.receiverId;

        return entity;
    }

    fromEntity(entity: InvoiceEntity): Invoice {
        const invoice = new Invoice();
        invoice.id = entity.id;
        invoice.amount = entity.amount;
        invoice.issueDate = entity.issueDate;
        invoice.paymentDate = entity.paymentDate;
        invoice.issuerId = entity.issuerId;
        invoice.receiverId = entity.receiverId;

        return invoice;
    }
}

export default InvoiceMapper;
