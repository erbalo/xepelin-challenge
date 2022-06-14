import { Router } from 'express';
import { autoInjectable } from 'tsyringe';
import BusinessNetworkController from '../controllers/business.network.controller';

@autoInjectable()
class BusinessNetworkRouter {
    private businessNetworkController: BusinessNetworkController;

    constructor(businessNetworkController: BusinessNetworkController) {
        this.businessNetworkController = businessNetworkController;
    }

    routes(): Router {
        const invoiceRouter = Router();

        invoiceRouter.get('/top', this.businessNetworkController.topNetwork);

        return invoiceRouter;
    }
}

export default BusinessNetworkRouter;
