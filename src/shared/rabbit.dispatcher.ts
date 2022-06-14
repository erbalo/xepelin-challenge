import { instanceToPlain } from 'class-transformer';
import { autoInjectable, inject } from 'tsyringe';
import { Invoice } from '../invoice-service/representations/invoice';
import { RabbitConnection } from '../commons';

@autoInjectable()
class RabbitDispatcher {
    private rabbitConnection: RabbitConnection;
    private invoicePipelineQueue: string;

    constructor(@inject('InvoicePipelineQueue') invoicePipelineQueue: string, @inject('RabbitConnection') rabbitConnection: RabbitConnection) {
        this.rabbitConnection = rabbitConnection;
        this.invoicePipelineQueue = invoicePipelineQueue;
    }

    publishInvoice = (invoice: Invoice): void => {
        const { channel } = this.rabbitConnection;
        const json = JSON.stringify(instanceToPlain(invoice));
        channel.sendToQueue(this.invoicePipelineQueue, Buffer.from(json));
    };
}

export default RabbitDispatcher;
