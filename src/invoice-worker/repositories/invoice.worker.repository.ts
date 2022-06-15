import { injectable } from 'tsyringe';
import { Logger as LoggerFactory } from '../../commons';
import DynamoConfiguration from '../../configurations/dynamo.configuration';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import InvoiceWorkerEntity from '../entities/invoice.worker.entity';
import { ItemNotFoundException } from '@aws/dynamodb-data-mapper';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class InvoiceWorkerRepository {
    private dynamoConfiguration: DynamoConfiguration;

    constructor(dynamoConfiguration: DynamoConfiguration) {
        this.dynamoConfiguration = dynamoConfiguration;
    }

    async getBy(fileName: string): Promise<InvoiceWorkerEntity | null> {
        const mapper = this.dynamoConfiguration.getMapper();

        const workerToSearch = new InvoiceWorkerEntity();
        workerToSearch.fileName = fileName;
        try {
            const worker = await mapper.get(workerToSearch);
            return worker;
        } catch (err) {
            if (err instanceof ItemNotFoundException) {
                return null;
            }
        }
    }

    async getFirstWorker(): Promise<InvoiceWorkerEntity | null> {
        const mapper = this.dynamoConfiguration.getMapper();

        const chunkCondition: ConditionExpression = {
            type: 'GreaterThan',
            subject: 'chunks',
            object: 0,
        };

        const workerPaginator = mapper.scan(InvoiceWorkerEntity, { filter: chunkCondition });
        const workers: InvoiceWorkerEntity[] = [];

        for await (const worker of workerPaginator) {
            workers.push(worker);
        }

        return workers.length > 0 ? workers[0] : null;
    }

    async save(worker: InvoiceWorkerEntity): Promise<InvoiceWorkerEntity | null> {
        const mapper = this.dynamoConfiguration.getMapper();
        try {
            return await mapper.put(worker);
        } catch (err) {
            const { message, name } = err as Error;
            Logger.error(name, message);
        }

        return null;
    }

    async reduceChunk(fileName: string) {
        const mapper = this.dynamoConfiguration.getMapper();
        const currentWorker = await this.getBy(fileName);

        const updateWoker = new InvoiceWorkerEntity();
        updateWoker.fileName = fileName;
        updateWoker.chunks = Number(currentWorker.chunks) - 1;
        updateWoker.path = currentWorker.path;
        updateWoker.extension = currentWorker.extension;

        try {
            await mapper.put(updateWoker);
        } catch (err) {
            const { message, name } = err as Error;
            Logger.error(name, message);
        }
    }
}

export default InvoiceWorkerRepository;
