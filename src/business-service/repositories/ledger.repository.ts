import { injectable } from 'tsyringe';
import DbConfiguration from '../../configurations/db.configuration';
import LedgerEntity from '../entities/ledger.entity';
import { ReportOperation, ReportSummary } from '../representations/ledger.representation';

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

    async retriveSummary(businessId: number, operation: ReportOperation): Promise<ReportSummary[]> {
        const connection = await this.dbConfiguration.getConnection();
        const repo = connection.getRepository(LedgerEntity);
        const { fromDate, toDate = new Date() } = operation;

        const summaries = await repo
            .createQueryBuilder('ledger')
            .select('type, sum(amount) as total_amount')
            .where('ledger.business_id = :businessId and ledger.payment_date between :from and :to', {
                businessId,
                from: fromDate,
                to: toDate,
            })
            .groupBy('ledger.type')
            .getRawMany();

        return summaries.map(row => {
            const summary: ReportSummary = {
                ...row,
            };

            return summary;
        });
    }
}

export default LedgerRepository;
