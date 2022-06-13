import { singleton } from 'tsyringe';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DynamoDB } from 'aws-sdk';

@singleton()
class DynamoConfiguration {
    private mapper: DataMapper;

    constructor() {
        const dynamoDBOptions: DynamoDB.ClientConfiguration = {
            region: process.env.AWS_REGION || 'local',
            endpoint: process.env.ENDPOINT_DYNAMO || 'http://localhost:8000',
        };

        const client = new DynamoDB(dynamoDBOptions);
        this.mapper = new DataMapper({ client });
    }

    getMapper() {
        return this.mapper;
    }
}

export default DynamoConfiguration;
