import { injectable } from 'tsyringe';
import BusinessNetworkService from '../../business-service/services/business.network.service';
import { InvoiceContext, Stage } from './stage';

@injectable()
class SaveNetworkStage extends Stage {
    private businessNetworkService: BusinessNetworkService;

    constructor(businessNetworkService: BusinessNetworkService) {
        super();
        this.businessNetworkService = businessNetworkService;
    }

    async execute(context: InvoiceContext): Promise<boolean> {
        await this.businessNetworkService.buildNetworkFrom(context.invoice);
        return await this.checkNext(context);
    }
}

export default SaveNetworkStage;
