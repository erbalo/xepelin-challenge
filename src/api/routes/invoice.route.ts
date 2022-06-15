import { autoInjectable } from 'tsyringe';
import { Router } from 'express';
import InvoiceController from '../controllers/invoice.controller';
import { asyncHandler } from '../../commons';

@autoInjectable()
class InvoiceRouter {
    private invoiceController: InvoiceController;

    constructor(invoiceController: InvoiceController) {
        this.invoiceController = invoiceController;
    }

    routes(): Router {
        const invoiceRouter = Router();

        invoiceRouter.post('/process', asyncHandler(this.invoiceController.processFile));

        return invoiceRouter;
    }
}

export default InvoiceRouter;
