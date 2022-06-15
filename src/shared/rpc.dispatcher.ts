import { inject, singleton } from 'tsyringe';
import { BadRequestError, Logger as LoggerFactory, NotFoundError, RabbitConnection, ServerError } from '../commons';
import { AmpqRpcConsumer } from 'amqp-rpc-lib';
import { v4 as uuidv4 } from 'uuid';

const Logger = LoggerFactory.getLogger(module);

interface DataResponse<R> {
    status_code: number;
    data: R;
    message?: string;
}

@singleton()
class RpcDispatcher {
    private rabbitConnection: RabbitConnection;

    constructor(@inject('RabbitConnection') rabbitConnection: RabbitConnection) {
        this.rabbitConnection = rabbitConnection;
    }

    async dispatch<T, R>(request: T, queueName: string): Promise<R> {
        const timeout = 120_000;

        const client = new AmpqRpcConsumer(this.rabbitConnection.connection, {
            requestsQueue: queueName,
            timeout: timeout,
        });

        await client.start();

        let data: DataResponse<R>;
        try {
            const response = await client.sendAndReceive(request, { correlationId: uuidv4() });
            data = response as DataResponse<R>;
        } catch (e) {
            // means a connection error
            Logger.error(e, e.message);
            return null;
        } finally {
            await client.disconnect();
        }

        if (data.status_code >= 200 && data.status_code <= 206) {
            return data.data as R;
        }

        if (data.status_code == 400) {
            throw new BadRequestError(data.message);
        }

        if (data.status_code == 404) {
            throw new NotFoundError(data.message);
        }

        throw new ServerError(`Error performing the dispatcher request [${queueName}] with ${JSON.stringify(data)}`);
    }
}

export default RpcDispatcher;
