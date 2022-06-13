import { autoInjectable, container, injectable } from 'tsyringe';
import { Router } from 'express';
import InvoiceController from '../controllers/invoice.controller';

@autoInjectable()
class InvoiceRouter {
    private invoiceController: InvoiceController;

    constructor(invoiceController: InvoiceController) {
        this.invoiceController = invoiceController;
    }

    routes(): Router {
        const invoiceRouter = Router();

        invoiceRouter.post('/process', this.invoiceController.processFile);

        return invoiceRouter;
    }
}

export default InvoiceRouter;
