import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { DynamoDB } from 'aws-sdk';
import moment from 'moment';

const dateMarshall = (value: Date): DynamoDB.AttributeValue => ({ S: moment(value).format('YYYY-MM-DD') } as DynamoDB.AttributeValue);
const dateCompleteMarshall = (value: Date): DynamoDB.AttributeValue =>
    ({ S: moment(value).format('YYYY-MM-DDTHH:mm:ssZ') } as DynamoDB.AttributeValue);
const dateUnmarshall = ({ S }: DynamoDB.AttributeValue): Date | undefined => (S ? new Date(S) : undefined);

export const ISSUER_GSI = 'issuer-idx';
export const RECEIVER_GSI = 'receiver-idx';

@table('invoices')
class InvoiceEntity {
    @hashKey()
    id?: number;

    @attribute({ attributeName: 'issue_date', type: 'Custom', marshall: dateMarshall, unmarshall: dateUnmarshall })
    issueDate: Date;

    @attribute({
        attributeName: 'payment_date',
        type: 'Custom',
        marshall: dateMarshall,
        unmarshall: dateUnmarshall,
    })
    paymentDate: Date;

    @attribute({
        attributeName: 'issuer_id',
        indexKeyConfigurations: {
            [ISSUER_GSI]: 'HASH',
        },
    })
    issuerId: number;

    @attribute({
        attributeName: 'receiver_id',
        indexKeyConfigurations: {
            [RECEIVER_GSI]: 'HASH',
        },
    })
    receiverId: number;

    @attribute()
    amount: number;

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

export default InvoiceEntity;
