import { container } from 'tsyringe';
import { delay, RabbitConnection } from '../commons';
import RabbitConfiguration from '../configurations/rabbit.configuration';
import SaveBusinessHandler from '../business-service/handlers/save.business.handler';
import SaveInvoiceHandler from '../invoice-service/handlers/save.invoice.handler';
import InvoicePipelineHandler from '../invoice-orchestrator/handlers/invoice.pipeline.handler';
import ProcessChunkWorker from '../invoice-worker/workers/process.chunk.worker';

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

export const bindWorkers = async () => {
    // Start the workers after the context loaded
    await delay(10_000);
    const processChunkWorker = container.resolve(ProcessChunkWorker);
    const workers = [processChunkWorker];

    workers.forEach(async worker => {
        await worker.execute();
    });
};
