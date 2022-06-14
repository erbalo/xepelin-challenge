import { injectable } from 'tsyringe';
import DbConfiguration from '../../configurations/db.configuration';
import BusinessEntity from '../entities/business.entity';

@injectable()
class BusinessRepository {
    private dbConfiguration: DbConfiguration;

    constructor(dbConfiguration: DbConfiguration) {
        this.dbConfiguration = dbConfiguration;
    }

    async getBy(businessId: number): Promise<BusinessEntity> {
        const connection = await this.dbConfiguration.getConnection();
        const repo = connection.getRepository(BusinessEntity);
        const business = await repo.createQueryBuilder('business').where('business.id = :businessId', { businessId }).getOne();

        return business;
    }

    async save(businessId: number): Promise<BusinessEntity> {
        const connection = await this.dbConfiguration.getConnection();
        const repo = connection.getRepository(BusinessEntity);

        const entity = new BusinessEntity();
        entity.id = businessId;

        const saved = await repo.save(entity);
        return saved;
    }
}

export default BusinessRepository;
