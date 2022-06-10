import { autoInjectable, inject, injectable } from 'tsyringe';
import { Invoice } from '../representations/invoice';
import InvoiceMapper from '../mappers/invoice.mapper';
import { Logger as LoggerFactory } from '../../commons';
import InvoiceRepository from '../repositories/invoice.repository';

const Logger = LoggerFactory.getLogger(module);

@autoInjectable()
class InvoiceService {
    private invoiceMapper: InvoiceMapper;
    private invoiceRepository: InvoiceRepository;

    constructor(invoiceMapper: InvoiceMapper, invoiceRepository: InvoiceRepository) {
        this.invoiceMapper = invoiceMapper;
        this.invoiceRepository = invoiceRepository;
    }

    async save(invoice: Invoice) {
        Logger.info(`Request to save :`, JSON.stringify(invoice));
        const toSave = this.invoiceMapper.fromDto(invoice);
        await this.invoiceRepository.save(toSave);
    }
}

export default InvoiceService;
