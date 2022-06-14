import { injectable } from 'tsyringe';
import SaveBusinessStage from '../chain/save.business.stage';
import SaveInvoiceStage from '../chain/save.invoice.stage';
import SaveLedgerStage from '../chain/save.ledger.stage';
import SaveNetworkStage from '../chain/save.network.stage';
import { Stage } from '../chain/stage';

@injectable()
class StageFactory {
    private saveInvoiceStage: SaveInvoiceStage;
    private saveBusinessStage: SaveBusinessStage;
    private saveLedgerStage: SaveLedgerStage;
    private saveNetworkStage: SaveNetworkStage;

    constructor(
        saveInvoiceStage: SaveInvoiceStage,
        saveBusinessStage: SaveBusinessStage,
        saveLedgerStage: SaveLedgerStage,
        saveNetworkStage: SaveNetworkStage,
    ) {
        this.saveInvoiceStage = saveInvoiceStage;
        this.saveBusinessStage = saveBusinessStage;
        this.saveLedgerStage = saveLedgerStage;
        this.saveNetworkStage = saveNetworkStage;
    }

    invoiceStagePipeline(): Stage {
        const stage: Stage = this.saveInvoiceStage;
        //stage.linkWith(this.saveBusinessStage);
        //.linkWith(this.saveLedgerStage).linkWith(this.saveNetworkStage);

        return stage;
    }
}

export default StageFactory;
