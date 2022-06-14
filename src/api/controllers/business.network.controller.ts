import { Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import BusinessNetworkService from '../../business-service/services/business.network.service';

@autoInjectable()
class BusinessNetworkController {
    private businessNetworkService: BusinessNetworkService;

    constructor(businessNetworkService: BusinessNetworkService) {
        this.businessNetworkService = businessNetworkService;
    }

    topNetwork = async (req: Request, res: Response) => {
        const { limit } = req.query;
        const topNetworks = await this.businessNetworkService.topNetwork(parseInt(limit.toString()));

        return res.send({
            status: 200,
            data: topNetworks,
        });
    };
}

export default BusinessNetworkController;
