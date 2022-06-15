import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { dirname } from 'path';
import InvoiceReaderService from '../../invoice-worker/services/invoice.reader.service';
import { BadRequestError } from '../../commons';

@autoInjectable()
class InvoiceController {
    private invoiceReaderService: InvoiceReaderService;

    constructor(invoiceReaderService: InvoiceReaderService) {
        this.invoiceReaderService = invoiceReaderService;
    }

    processFile = async (req: Request, res: Response) => {
        const { file_name: fileName, extension } = req.query;
        const dir = dirname(require.main.filename);

        if (!fileName || !extension) {
            throw new BadRequestError('File name or extension is null');
        }

        let inputVolume = dir.replace(/\/src$/, '/input');
        const isDist = process.env.IS_DIST || false;

        if (isDist) {
            inputVolume = dir.replace(/\/build$/, '/input');
        }

        const workerChunk = await this.invoiceReaderService.processVolume(
            inputVolume,
            fileName.toString(),
            extension.toString(),
        );

        return res.send({
            status: 202,
            data: workerChunk,
        });
    };
}

export default InvoiceController;
