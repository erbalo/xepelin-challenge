import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { DynamoDB } from 'aws-sdk';

const dateMarshall = (value: Date): DynamoDB.AttributeValue => ({ S: value.toString() } as DynamoDB.AttributeValue);
const dateUnmarshall = ({ S }: DynamoDB.AttributeValue): Date | undefined => (S ? new Date(S) : undefined);

export const ISSUER_GSI = 'issuer-idx';
export const RECEIVER_GSI = 'receiver-idx';

@table('invoices')
class InvoiceEntity {
    @hashKey()
    id?: number;

    @attribute({ type: 'Custom', marshall: dateMarshall, unmarshall: dateUnmarshall })
    issue_date: Date;

    @attribute({ type: 'Custom', marshall: dateMarshall, unmarshall: dateUnmarshall })
    payment_date: Date;

    @attribute({
        indexKeyConfigurations: {
            [ISSUER_GSI]: 'HASH',
        },
    })
    issuer_id: number;

    @attribute({
        indexKeyConfigurations: {
            [RECEIVER_GSI]: 'HASH',
        },
    })
    receiver_id: number;

    @attribute()
    amount: number;
}

export default InvoiceEntity;
