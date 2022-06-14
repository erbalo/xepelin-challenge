import fs from 'fs';
import { injectable } from 'tsyringe';
import { Logger as LoggerFactory, Reader } from '../../commons';
import RabbitDispatcher from '../../shared/rabbit.dispatcher';
import { Invoice } from '../representations/invoice';
import csvSplitStream from 'csv-split-stream';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class InvoiceReaderService {
    private rabbitDispatcher: RabbitDispatcher;

    constructor(rabbitDispatcher: RabbitDispatcher) {
        this.rabbitDispatcher = rabbitDispatcher;
    }

    async processVolume(volume: string, fileName: string, extension: string) {
        const file = `${volume}/${fileName}.${extension}`;

        const splittedDirectory = `${volume}/${fileName}-to-process`;

        if (!fs.existsSync(splittedDirectory)) {
            fs.mkdirSync(splittedDirectory);
        }

        const x = await csvSplitStream
            .split(
                fs.createReadStream(file),
                {
                    lineLimit: 1000,
                },
                (index: number) => fs.createWriteStream(`${volume}/${fileName}-to-process/${fileName}_${index}.csv`),
            )
            .then(csvSplitResponse => {
                console.log('csvSplitStream succeeded.', csvSplitResponse);
                return csvSplitResponse;
            })
            .catch(csvSplitError => {
                console.log('csvSplitStream failed!', csvSplitError);
            });

        console.log(x);
        const chunks = x?.totalChunks || 0;

        for (let i = 0; i < chunks; i++) {
            const fileSplitted = `${fileName}_${i}`;
            const reader = new Reader(splittedDirectory, fileSplitted, extension);
            reader.applyOnEachLine((line, index) => {
                try {
                    const invoice = this.parse(line, index);
                    this.rabbitDispatcher.publishInvoice(invoice);
                } catch (err) {
                    const { message } = err as Error;
                    Logger.error(message);
                }
            });
            await this.delay(60_000);
        }
    }

    delay(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    private parse(line: string, index: number): Invoice {
        if (!line) {
            throw new Error(`Skipping line because is null or empty in position [${index}]`);
        }

        const values = line.split(',');

        if (values.length < 5) {
            throw new Error(`line hasn't the required structure ${values} in position [${index}]`);
        }

        const id = parseInt(values[0]);
        const issuerId = parseInt(values[1]);
        const receiverId = parseInt(values[2]);
        const amount = parseFloat(values[3]);
        const issueDate = new Date(values[4]);
        const paymentDate = new Date(values[5]);

        const invoice = new Invoice();
        invoice.id = id;
        invoice.amount = amount;
        invoice.receiverId = receiverId;
        invoice.issuerId = issuerId;
        invoice.paymentDate = paymentDate;
        invoice.issueDate = issueDate;

        return invoice;
    }
}

export default InvoiceReaderService;
