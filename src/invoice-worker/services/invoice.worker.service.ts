import { injectable } from 'tsyringe';
import { Logger as LoggerFactory, Reader } from '../../commons';
import RabbitDispatcher from '../../shared/rabbit.dispatcher';
import { Invoice } from '../../invoice-service/representations/invoice';
import InvoiceWorkerRepository from '../repositories/invoice.worker.repository';
import InvoiceWorkerEntity from '../entities/invoice.worker.entity';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class InvoiceWorkerService {
    private rabbitDispatcher: RabbitDispatcher;
    private invoiceWorkerRepository: InvoiceWorkerRepository;

    constructor(rabbitDispatcher: RabbitDispatcher, invoiceWorkerRepository: InvoiceWorkerRepository) {
        this.rabbitDispatcher = rabbitDispatcher;
        this.invoiceWorkerRepository = invoiceWorkerRepository;
    }

    async firstProcessableWorker(): Promise<InvoiceWorkerEntity | null> {
        return await this.invoiceWorkerRepository.getFirstWorker();
    }

    async processChunk(path: string, fileName: string, extension: string, indexChunk: number) {
        const file = `${fileName}_${indexChunk}.${extension}`;
        const reader = new Reader(path, file);
        reader.applyOnEachLine((line, index) => {
            try {
                const invoice = this.parse(line, index);
                this.rabbitDispatcher.publishInvoice(invoice);
            } catch (err) {
                const { message } = err as Error;
                Logger.error(message);
            }
        });

        this.invoiceWorkerRepository.reduceChunk(fileName);
    }

    private parse(line: string, index: number): Invoice {
        if (!line) {
            throw new Error(`Skipping line because is null or empty in position [${index}]`);
        }

        const values = line.split(',');

        if (values.length < 5) {
            throw new Error(`line hasn't the required structure ${values} in position [${index}]`);
        }

        const id = parseInt(values[0]);
        const issuerId = parseInt(values[1]);
        const receiverId = parseInt(values[2]);
        const amount = parseFloat(values[3]);
        const issueDate = new Date(values[4]);
        const paymentDate = new Date(values[5]);

        const invoice = new Invoice();
        invoice.id = id;
        invoice.amount = amount;
        invoice.receiverId = receiverId;
        invoice.issuerId = issuerId;
        invoice.paymentDate = paymentDate;
        invoice.issueDate = issueDate;

        return invoice;
    }
}

export default InvoiceWorkerService;
