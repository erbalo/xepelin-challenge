import { autoInjectable, injectable } from 'tsyringe';
import { Logger as LoggerFactory } from '../../commons';
import DynamoConfiguration from '../../configurations/dynamo.configuration';
import InvoiceEntity from '../entities/invoice.entity';
import { AttributePath, FunctionExpression } from '@aws/dynamodb-expressions';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class InvoiceRepository {
    private dynamoConfiguration: DynamoConfiguration;

    constructor(dynamoConfiguration: DynamoConfiguration) {
        this.dynamoConfiguration = dynamoConfiguration;
    }

    async save(invoice: InvoiceEntity): Promise<InvoiceEntity | null> {
        const mapper = this.dynamoConfiguration.getMapper();
        try {
            return await mapper.put(invoice, {
                condition: new FunctionExpression('attribute_not_exists', new AttributePath('id')),
            });
        } catch (err) {
            const { message, name } = err as Error;
            Logger.error(name, message);
        }

        return Promise.resolve(null);
    }
}

export default InvoiceRepository;
