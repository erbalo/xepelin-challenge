import { injectable } from 'tsyringe';
import { Logger as LoggerFactory } from '../../commons';
import InvoiceWorkerService from '../services/invoice.worker.service';
import { Worker, WorkerStatus } from './worker';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class ProcessChunkWorker extends Worker {
    private invoiceWorkerService: InvoiceWorkerService;

    constructor(invoiceWorkerService: InvoiceWorkerService) {
        super(process.env.CHUNK_WORKER_CRON || '*/2 * * * *');
        this.invoiceWorkerService = invoiceWorkerService;
    }

    async execute(): Promise<WorkerStatus> {
        const worker = await this.invoiceWorkerService.firstProcessableWorker();

        if (worker) {
            Logger.info(`Executing worker from ${JSON.stringify(worker)}`);
            const { path, fileName, extension, chunks: indexChunk } = worker;
            await this.invoiceWorkerService.processChunk(path, fileName, extension, indexChunk - 1);
            return { sucess: true };
        }

        Logger.warn(`Nothing to execute`);
        return { sucess: false };
    }
}

export default ProcessChunkWorker;
