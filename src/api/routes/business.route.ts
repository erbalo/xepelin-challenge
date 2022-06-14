import { Router } from 'express';
import { autoInjectable } from 'tsyringe';
import BusinessController from '../controllers/business.controller';
import { asyncHandler } from '../../commons';

@autoInjectable()
class BusinessRouter {
    private businessController: BusinessController;

    constructor(businessController: BusinessController) {
        this.businessController = businessController;
    }

    routes(): Router {
        const invoiceRouter = Router();

        invoiceRouter.get('/:id/summary', asyncHandler(this.businessController.summary));

        return invoiceRouter;
    }
}

export default BusinessRouter;
