import { container } from 'tsyringe';
import SaveInvoiceHandler from '../invoice-service/handlers/save.invoice.handler';
import { RabbitConnection } from '../commons';
import RabbitConfiguration from '../configurations/rabbit.configuration';

export const rabbitIoC = async (): Promise<void> => {
    const configuration = container.resolve(RabbitConfiguration);
    const rabbit = await configuration.init();
    container.register<RabbitConnection>('RabbitConnection', { useValue: rabbit.getConnection() });
};

export const queueNamesIoC = () => {
    container.register('SaveInvoiceQueue', { useValue: 'com.xepelin.v1.service.billing.invoice.save' });
};

export const bindQueueConsumersIoC = () => {
    const saveInvoiceResolved = container.resolve(SaveInvoiceHandler);

    const handlers = [saveInvoiceResolved];

    handlers.forEach(async handler => {
        await handler.bind();
    });
};
