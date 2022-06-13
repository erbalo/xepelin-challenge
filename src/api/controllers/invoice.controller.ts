import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { dirname } from 'path';
import InvoiceReaderService from '../../invoice-service/services/invoice.reader.service';

@autoInjectable()
class InvoiceController {
    private invoiceReaderService: InvoiceReaderService;

    constructor(invoiceReaderService: InvoiceReaderService) {
        this.invoiceReaderService = invoiceReaderService;
    }

    processFile = (req: Request, res: Response) => {
        const { file_name: fileName, extension } = req.query;
        const dir = dirname(require.main.filename);
        const inputVolume = dir.replace(/\/src$/, '/input');

        this.invoiceReaderService.processVolume(inputVolume, fileName.toString(), extension.toString());

        return res.sendStatus(202);
    };
}

export default InvoiceController;
