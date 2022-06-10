import 'reflect-metadata';
import 'es6-shim';
import express from 'express';
//import dotenv from 'dotenv';
import expressReqId from 'express-request-id';
import { Logger as LoggerFactory, Middleware } from './commons';
import {
    bindQueueConsumersIoC,
    configurationsIoC,
    mappersIoC,
    queueNamesIoC,
    rabbitIoC,
    repositoriesIoC,
    servicesIoC,
} from './shared/container';

const Logger = LoggerFactory.getLogger(module);
//dotenv.config();

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.init();
    }

    private init(): void {
        this.middlewares();
        (async () => {
            await this.buildIoCContainer();
        })();
    }

    private middlewares(): void {
        const addRequestId = expressReqId();
        this.express.get('/health', (_, res) => {
            res.status(200).send();
        });
        this.express.use(addRequestId);
        this.express.use(Middleware.casaiMorgan);
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        Logger.info('Middlewares loaded correclty...');
    }

    private async buildIoCContainer(): Promise<void> {
        try {
            await rabbitIoC();
        } catch (error) {
            Logger.error('Error', error);
            process.exit(1);
        }
        configurationsIoC();
        mappersIoC();
        repositoriesIoC();
        servicesIoC();
        queueNamesIoC();
        bindQueueConsumersIoC();
    }
}

export default new App().express;
