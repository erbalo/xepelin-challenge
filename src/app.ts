import 'reflect-metadata';
import 'es6-shim';
import express from 'express';
//import dotenv from 'dotenv';
import expressReqId from 'express-request-id';
import { handleError, Logger as LoggerFactory, Middleware } from './commons';
import { bindQueueConsumersIoC, bindWorkers, queueNamesIoC, rabbitIoC } from './shared/container';
import { container } from 'tsyringe';
import InvoiceRouter from './api/routes/invoice.route';
import BusinessNetworkRouter from './api/routes/business.network.route';
import BusinessRouter from './api/routes/business.route';

const Logger = LoggerFactory.getLogger(module);
//dotenv.config();

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.init();
    }

    private init(): void {
        (async () => {
            await this.buildIoCContainer();
            this.middlewares();
            this.routes();
            this.errorHandling();
        })();
        (async () => {
            this.workersContext();
        })();
    }

    private errorHandling() {
        this.express.use(handleError);
        Logger.info('Error handler loaded correctly...');
    }

    private middlewares(): void {
        const addRequestId = expressReqId();
        this.express.get('/health', (_, res) => {
            res.status(200).send();
        });
        this.express.use(addRequestId);
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(Middleware.loggerMorgan);
        Logger.info('Middlewares loaded correctly...');
    }

    private routes() {
        const invoiceRouter = container.resolve(InvoiceRouter);
        const businessNetworkRouter = container.resolve(BusinessNetworkRouter);
        const businessRouter = container.resolve(BusinessRouter);
        this.express.use('/api/invoices', invoiceRouter.routes());
        this.express.use('/api/networks', businessNetworkRouter.routes());
        this.express.use('/api/businesses', businessRouter.routes());
        Logger.info('Routes loaded correctly...');
    }

    private async buildIoCContainer(): Promise<void> {
        try {
            await rabbitIoC();
        } catch (error) {
            Logger.error('Error', error);
            process.exit(1);
        }
        queueNamesIoC();
        bindQueueConsumersIoC();
        Logger.info('IoC loaded correctly...');
    }

    private async workersContext() {
        await bindWorkers();
        Logger.info('Workers context started...');
    }
}

export default new App().express;
