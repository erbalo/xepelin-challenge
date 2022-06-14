import { injectable } from 'tsyringe';
import { Invoice } from '../representations/invoice';
import InvoiceMapper from '../mappers/invoice.mapper';
import { Logger as LoggerFactory } from '../../commons';
import InvoiceRepository from '../repositories/invoice.repository';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class InvoiceService {
    private invoiceMapper: InvoiceMapper;
    private invoiceRepository: InvoiceRepository;

    constructor(invoiceMapper: InvoiceMapper, invoiceRepository: InvoiceRepository) {
        this.invoiceMapper = invoiceMapper;
        this.invoiceRepository = invoiceRepository;
    }

    async save(invoice: Invoice): Promise<Invoice> {
        Logger.info(`Invoice to save:`, JSON.stringify(invoice));
        const toSave = this.invoiceMapper.fromDto(invoice);
        const saved = await this.invoiceRepository.save(toSave);
        return this.invoiceMapper.fromEntity(saved);
    }
}

export default InvoiceService;
