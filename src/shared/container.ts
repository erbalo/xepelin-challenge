import { container } from 'tsyringe';
import { RabbitConnection } from '../commons';
import RabbitConfiguration from '../configurations/rabbit.configuration';
import SaveBusinessHandler from '../business-service/handlers/save.business.handler';
import SaveInvoiceHandler from '../invoice-service/handlers/save.invoice.handler';
import InvoicePipelineHandler from '../invoice-service/handlers/invoice.pipeline.handler';

export const rabbitIoC = async (): Promise<void> => {
    const configuration = container.resolve(RabbitConfiguration);
    const rabbit = await configuration.init();
    container.register<RabbitConnection>('RabbitConnection', { useValue: rabbit.getConnection() });
};

export const queueNamesIoC = () => {
    container.register('InvoicePipelineQueue', { useValue: 'com.xepelin.v1.service.invoice.pipeline' });
    container.register('SaveInvoiceQueue', { useValue: 'com.xepelin.v1.service.invoice.save' });
    container.register('SaveBusinessQueue', { useValue: 'com.xepelin.v1.service.business.save' });
};

export const bindQueueConsumersIoC = () => {
    const invoicePipelineResolved = container.resolve(InvoicePipelineHandler);
    const saveBusinessResolved = container.resolve(SaveBusinessHandler);
    const saveInvoiceResolved = container.resolve(SaveInvoiceHandler);

    const handlers = [invoicePipelineResolved, saveInvoiceResolved, saveBusinessResolved];

    handlers.forEach(async handler => {
        await handler.bind();
    });
};
