import { instanceToPlain } from 'class-transformer';
import { autoInjectable, inject } from 'tsyringe';
import { Invoice } from '../invoice-service/representations/invoice';
import { Logger as LoggerFactory, RabbitConnection } from '../commons';

const Logger = LoggerFactory.getLogger(module);

@autoInjectable()
class RabbitDispatcher {
    private queue: string;
    private rabbitConnection: RabbitConnection;

    constructor(@inject('SaveInvoiceQueue') queue: string, @inject('RabbitConnection') rabbitConnection: RabbitConnection) {
        this.queue = queue;
        this.rabbitConnection = rabbitConnection;
    }

    publishInvoice = (invoice: Invoice): void => {
        const { channel } = this.rabbitConnection;
        const json = JSON.stringify(instanceToPlain(invoice));
        Logger.info(json);
        channel.sendToQueue(this.queue, Buffer.from(json));
    };
}

export default RabbitDispatcher;
