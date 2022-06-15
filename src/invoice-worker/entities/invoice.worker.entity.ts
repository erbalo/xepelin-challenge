import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';

const dateCompleteMarshall = (value: Date): DynamoDB.AttributeValue =>
    ({ S: moment(value).format('YYYY-MM-DDTHH:mm:ssZ') } as DynamoDB.AttributeValue);
const dateUnmarshall = ({ S }: DynamoDB.AttributeValue): Date | undefined => (S ? new Date(S) : undefined);

@table('invoice-workers')
class InvoiceWorkerEntity {
    @hashKey({ attributeName: 'file_name' })
    fileName: string;

    @attribute()
    extension: string;

    @attribute()
    chunks: number;

    @attribute()
    path: string;

    @attribute({
        attributeName: 'created_at',
        type: 'Custom',
        marshall: dateCompleteMarshall,
        unmarshall: dateUnmarshall,
        defaultProvider: () => new Date(),
    })
    createdAt?: Date;

    @attribute({
        attributeName: 'updated_at',
        type: 'Custom',
        marshall: dateCompleteMarshall,
        unmarshall: dateUnmarshall,
        defaultProvider: () => new Date(),
    })
    updatedAt?: Date;
}

export default InvoiceWorkerEntity;
