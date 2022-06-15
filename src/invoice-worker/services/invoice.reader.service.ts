import fs from 'fs';
import { injectable } from 'tsyringe';
import { Logger as LoggerFactory, NotAcceptableError } from '../../commons';
import csvSplitStream from 'csv-split-stream';
import InvoiceWorkerRepository from '../repositories/invoice.worker.repository';
import InvoiceWorkerEntity from '../entities/invoice.worker.entity';
import { InvoiceWorker } from '../representations/invoice.worker.reprentation';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class InvoiceReaderService {
    private invoiceWorkerRepository: InvoiceWorkerRepository;

    constructor(invoiceWorkerRepository: InvoiceWorkerRepository) {
        this.invoiceWorkerRepository = invoiceWorkerRepository;
    }

    async processVolume(volume: string, fileName: string, extension: string): Promise<InvoiceWorker> {
        const currentWorker = await this.invoiceWorkerRepository.getBy(fileName);

        if (currentWorker) {
            throw new NotAcceptableError(`Currently, this file[${fileName}.${extension}] already has been processed`);
        }

        const file = `${volume}/${fileName}.${extension}`;
        const splittedDirectory = `${volume}/${fileName}-to-process`;

        if (!fs.existsSync(splittedDirectory)) {
            fs.mkdirSync(splittedDirectory);
        }

        const limit = process.env.CSV_SPLIT_LIMIT || 100;

        const result = await csvSplitStream
            .split(fs.createReadStream(file), { lineLimit: limit }, (index: number) =>
                fs.createWriteStream(`${splittedDirectory}/${fileName}_${index}.csv`),
            )
            .then(csvSplitResponse => {
                Logger.info('CSV splitted succeeded', csvSplitResponse);
                return csvSplitResponse;
            })
            .catch(csvSplitError => {
                Logger.error('CSV splitted failed', csvSplitError);
            });

        const totalChunks = result?.totalChunks || 0;

        const worker = new InvoiceWorkerEntity();
        worker.chunks = totalChunks;
        worker.fileName = fileName;
        worker.extension = extension;
        worker.path = splittedDirectory;

        const saved = await this.invoiceWorkerRepository.save(worker);
        const { chunks, path, extension: fileExtension } = saved;

        const representation: InvoiceWorker = {
            file_name: saved.fileName,
            extension: fileExtension,
            chunks,
            path,
        };

        return representation;
    }
}

export default InvoiceReaderService;
