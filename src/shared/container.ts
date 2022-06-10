import { container, Lifecycle } from 'tsyringe';
import SaveInvoiceHandler from '../billing-service/handlers/save.invoice.handler';
import InvoiceMapper from '../billing-service/mappers/invoice.mapper';
import InvoiceRepository from '../billing-service/repositories/invoice.repository';
import InvoiceService from '../billing-service/services/invoice.service';
import DynamoConfiguration from '../configurations/dynamo.configuration';
import RabbitConfiguration from '../configurations/rabbit.configuration';

export const rabbitIoC = async (): Promise<void> => {
    const configuration = container.resolve(RabbitConfiguration);
    const rabbit = await configuration.init();
    container.register('RabbitConnection', { useValue: rabbit.getConnection() });
};

export const queueNamesIoC = () => {
    container.register('SaveInvoceQueue', { useValue: 'com.xepelin.v1.service.billing.invoice.save' });
};

export const configurationsIoC = () => {
    container.register<DynamoConfiguration>('DynamoConfiguration', DynamoConfiguration, {
        lifecycle: Lifecycle.Singleton,
    });
};

export const mappersIoC = () => {
    container.registerSingleton<InvoiceMapper>('InvoiceMapper', InvoiceMapper);
};

export const repositoriesIoC = () => {
    container.register<InvoiceRepository>('InvoiceRepository', InvoiceRepository, { lifecycle: Lifecycle.Singleton });
};

export const servicesIoC = () => {
    container.register<InvoiceService>('InvoiceService', InvoiceService, { lifecycle: Lifecycle.Singleton });
};

export const bindQueueConsumersIoC = () => {
    const saveInvoiceResolved = container.resolveAll(SaveInvoiceHandler);

    const consumers = [saveInvoiceResolved];

    consumers.forEach(async resolveDependencies => {
        resolveDependencies.forEach(async consumer => {
            await consumer.bind();
        });
    });
};
