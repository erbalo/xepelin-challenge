import { Connection, Channel } from 'amqplib';

export interface RabbitConnection {
    connection: Connection;
    channel: Channel;
}

export interface RabbitHandler {
    bind(): Promise<void>;
}
