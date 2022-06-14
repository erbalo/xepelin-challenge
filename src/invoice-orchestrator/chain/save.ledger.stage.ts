import { injectable } from 'tsyringe';
import LedgerService from '../../business-service/services/ledger.service';
import { InvoiceContext, Stage } from './stage';

@injectable()
class SaveLedgerStage extends Stage {
    private ledgerService: LedgerService;

    constructor(ledgerService: LedgerService) {
        super();
        this.ledgerService = ledgerService;
    }

    async execute(context: InvoiceContext): Promise<boolean> {
        await this.ledgerService.applyFrom(context.invoice);
        return await this.checkNext(context);
    }
}

export default SaveLedgerStage;
