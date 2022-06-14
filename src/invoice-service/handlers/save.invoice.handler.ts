import { inject, injectable } from 'tsyringe';
import { AmqpRpcProducer } from 'amqp-rpc-lib';
import { DuplicatedError, Logger as LoggerFactory, RabbitConnection, RabbitHandler } from '../../commons';
import InvoiceService from '../services/invoice.service';
import { Invoice } from '../representations/invoice';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class SaveInvoiceHandler implements RabbitHandler {
    private rabbitConnection: RabbitConnection;
    private queue: string;
    private invoiceService: InvoiceService;

    constructor(
        @inject('SaveInvoiceQueue') queue: string,
        @inject('RabbitConnection') rabbitConnection: RabbitConnection,
        invoiceService: InvoiceService,
    ) {
        this.invoiceService = invoiceService;
        this.queue = queue;
        this.rabbitConnection = rabbitConnection;
    }

    async bind(): Promise<void> {
        await this.rabbitConnection.channel.assertQueue(this.queue, {
            deadLetterRoutingKey: this.queue + '.expired',
            deadLetterExchange: this.queue + '.direct',
            messageTtl: 30_000,
            durable: false,
        });

        const producer = new AmqpRpcProducer(this.rabbitConnection.connection, {
            requestsQueue: this.queue,
        });

        producer.registerListener(async request => {
            const invoiceRequest = request as Invoice;

            try {
                const invoice = await this.invoiceService.save(invoiceRequest);
                return { status_code: 201, data: invoice };
            } catch (err) {
                if (err instanceof DuplicatedError) {
                    const message = `Not possible to save duplicated invoices using id[${invoiceRequest.id}]`;
                    Logger.error(message);
                    return { status_code: 406, message };
                } else {
                    const { message } = err as Error;
                    Logger.error('Unkown error', message);
                    return { status_code: 422, message: 'Not possible to save the invoice, weird reason' };
                }
            }
        });

        await producer.start();
    }
}

export default SaveInvoiceHandler;
