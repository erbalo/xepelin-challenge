import 'reflect-metadata';
import 'es6-shim';
import express from 'express';
//import dotenv from 'dotenv';
import expressReqId from 'express-request-id';
import { handleError, Logger as LoggerFactory, Middleware } from './commons';
import { bindQueueConsumersIoC, queueNamesIoC, rabbitIoC } from './shared/container';
import invoiceRouter from './api/routes/invoice.route';
import { container } from 'tsyringe';
import InvoiceRouter from './api/routes/invoice.route';

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
        this.express.use('/api/invoices', invoiceRouter.routes());
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
}

export default new App().express;
