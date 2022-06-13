import { injectable } from 'tsyringe';
import DbConfiguration from '../../configurations/db.configuration';
import LedgerEntity from '../entities/ledger.entity';

@injectable()
class LedgerRepository {
    private dbConfiguration: DbConfiguration;

    constructor(dbConfiguration: DbConfiguration) {
        this.dbConfiguration = dbConfiguration;
    }

    async save(ledger: LedgerEntity): Promise<LedgerEntity> {
        const connection = await this.dbConfiguration.getConnection();
        const repo = connection.getRepository(LedgerEntity);

        return await repo.save(ledger);
    }
}

export default LedgerRepository;
