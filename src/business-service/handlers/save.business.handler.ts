import { inject, injectable } from 'tsyringe';
import { AmqpRpcProducer } from 'amqp-rpc-lib';
import { Logger as LoggerFactory, RabbitConnection, RabbitHandler } from '../../commons';
import BusinessService from '../services/business.service';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class SaveBusinessHandler implements RabbitHandler {
    private rabbitConnection: RabbitConnection;
    private queue: string;
    private businessService: BusinessService;

    constructor(
        @inject('SaveBusinessQueue') queue: string,
        @inject('RabbitConnection') rabbitConnection: RabbitConnection,
        businessService: BusinessService,
    ) {
        this.queue = queue;
        this.rabbitConnection = rabbitConnection;
        this.businessService = businessService;
    }

    async bind(): Promise<void> {
        await this.rabbitConnection.channel.assertQueue(this.queue, {
            deadLetterRoutingKey: this.queue + '.expired',
            deadLetterExchange: this.queue + '.direct',
            messageTtl: 30_000,
        });

        const producer = new AmqpRpcProducer(this.rabbitConnection.connection, {
            requestsQueue: this.queue,
        });

        producer.registerListener(async request => {
            Logger.info(`Receiving request ${this.queue}: ${JSON.stringify(request)}`);
            if (!request.business_id)
                return {
                    status_code: 400,
                    message: 'Business id is required.',
                };

            const businessId = request.business_id;
            try {
                const business = await this.businessService.save(businessId);
                return {
                    status_code: 201,
                    data: business,
                };
            } catch (e) {
                Logger.error(e.message);
                return { status_code: 500 };
            }
        });

        await producer.start();
    }
}

export default SaveBusinessHandler;
