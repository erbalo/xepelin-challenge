import { Channel, ConsumeMessage } from 'amqplib';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { Logger as LoggerFactory, RabbitConnection, RabbitHandler } from '../../commons';
import StageFactory from '../../invoice-orchestrator/factory/stage.factory';
import { Invoice } from '../representations/invoice';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class InvoicePipelineHandler implements RabbitHandler {
    private rabbitConnection: RabbitConnection;
    private queue: string;
    private stageFactory: StageFactory;

    constructor(
        @inject('InvoicePipelineQueue') queue: string,
        @inject('RabbitConnection') rabbitConnection: RabbitConnection,
        stageFactory: StageFactory,
    ) {
        this.queue = queue;
        this.rabbitConnection = rabbitConnection;
        this.stageFactory = stageFactory;
    }

    async bind(): Promise<void> {
        const consumer =
            (channel: Channel) =>
            async (msg: ConsumeMessage | null): Promise<void> => {
                if (msg) {
                    try {
                        const requestJson = JSON.parse(msg.content.toString());
                        const invoice = plainToInstance(Invoice, requestJson, { excludeExtraneousValues: true });
                        const pipeline = this.stageFactory.invoiceStagePipeline();
                        const context = { invoice };
                        pipeline.execute(context);
                    } catch (err: unknown) {
                        const { message } = err as Error;
                        Logger.error(message, err);
                    } finally {
                        channel.ack(msg);
                    }
                }
            };

        await this.rabbitConnection.channel.assertQueue(this.queue);
        await this.rabbitConnection.channel.consume(this.queue, consumer(this.rabbitConnection.channel));
    }
}

export default InvoicePipelineHandler;
