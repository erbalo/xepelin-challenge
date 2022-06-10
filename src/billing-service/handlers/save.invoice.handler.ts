import { Channel, ConsumeMessage } from 'amqplib';
import { plainToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { Logger as LoggerFactory, RabbitConnection, RabbitHandler } from '../../commons';
import { Invoice } from '../representations/invoice';
import InvoiceService from '../services/invoice.service';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class SaveInvoiceHandler implements RabbitHandler {
    private rabbitConnection: RabbitConnection;
    private queue: string;
    private invoiceService: InvoiceService;

    constructor(
        @inject('RabbitConnection') rabitConnection: RabbitConnection,
        @inject('SaveInvoceQueue') queue: string,
        @inject('InvoiceService') invoiceService: InvoiceService,
    ) {
        this.queue = queue;
        this.rabbitConnection = rabitConnection;
        this.invoiceService = invoiceService;
    }

    async bind(): Promise<void> {
        const consumer =
            (channel: Channel) =>
            async (msg: ConsumeMessage | null): Promise<void> => {
                if (msg) {
                    try {
                        const requestJson = JSON.parse(msg.content.toString());
                        const invoice = plainToClass(Invoice, requestJson, { excludeExtraneousValues: true });
                        await this.invoiceService.save(invoice);
                    } catch (err: unknown) {
                        const { message } = err as Error;
                        Logger.error(message);
                    } finally {
                        channel.ack(msg);
                    }
                }
            };

        await this.rabbitConnection.channel.assertQueue(this.queue);
        await this.rabbitConnection.channel.consume(this.queue, consumer(this.rabbitConnection.channel));
    }
}

export default SaveInvoiceHandler;
