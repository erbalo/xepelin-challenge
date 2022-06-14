import { injectable } from 'tsyringe';
import { Logger as LoggerFactory } from '../../commons';
import DbConfiguration from '../../configurations/db.configuration';
import BusinessNetworkEntity from '../entities/business.network.entity';
import {
    BusinessNetworkOperation,
    BusinessNetworkSearch,
    BusinessNetworkTop,
    NetworkOperation,
} from '../representations/business.network.representation';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class BusinessNetworkRepository {
    private dbConfiguration: DbConfiguration;

    constructor(dbConfiguration: DbConfiguration) {
        this.dbConfiguration = dbConfiguration;
    }

    async getBy(networkSearch: BusinessNetworkSearch): Promise<BusinessNetworkEntity> {
        const connection = await this.dbConfiguration.getConnection();
        const repo = connection.getRepository(BusinessNetworkEntity);
        const { businessId, businessRelationId, reportingDate } = networkSearch;

        return await repo.findOneBy({ businessId, businessRelationId, reportingDate });
    }

    async apply(networkOperation: BusinessNetworkOperation): Promise<BusinessNetworkEntity> {
        const connection = await this.dbConfiguration.getConnection();
        const repo = connection.getRepository(BusinessNetworkEntity);

        const networkSearch: BusinessNetworkSearch = { ...networkOperation, reportingDate: networkOperation.date };
        const network = await this.getBy(networkSearch);

        const toSave = new BusinessNetworkEntity();
        toSave.reportingDate = new Date(networkOperation.date);
        toSave.businessId = Number(networkOperation.businessId);
        toSave.businessRelationId = Number(networkOperation.businessRelationId);

        let currentIssued = 0,
            currentReceived = 0;

        if (network) {
            currentIssued = network.issuedInvoices;
            currentReceived = network.receivedInvoices;
            toSave.createdAt = network.createdAt;
            toSave.updatedAt = network.updatedAt;
        }

        if (networkOperation.type == NetworkOperation.ISSUED) {
            toSave.issuedInvoices = Number(currentIssued) + Number(1);
        } else {
            toSave.receivedInvoices = Number(currentReceived) + Number(1);
        }

        if (network) {
            return await this.update(networkSearch, toSave);
        }

        return await repo.save(toSave);
    }

    async update(networkSearch: BusinessNetworkSearch, entity: BusinessNetworkEntity): Promise<BusinessNetworkEntity> {
        Logger.info('Update network:', JSON.stringify(entity));
        const connection = await this.dbConfiguration.getConnection();
        const repo = connection.getRepository(BusinessNetworkEntity);
        const { businessId, businessRelationId, reportingDate } = networkSearch;

        const result = await repo.update(
            {
                businessId,
                businessRelationId,
                reportingDate,
            },
            {
                ...entity,
            },
        );

        return result.affected || 0 > 0 ? entity : null;
    }

    async topNetwork(limit = 5): Promise<BusinessNetworkTop[]> {
        const connection = await this.dbConfiguration.getConnection();
        const repo = connection.getRepository(BusinessNetworkEntity);

        const topNetworks = await repo
            .createQueryBuilder('network')
            .select('business_id, count(*) as total_relationship')
            .groupBy('network.business_id')
            .orderBy('total_relationship', 'DESC')
            .limit(limit)
            .getRawMany();

        return topNetworks.map(row => {
            const networkTop: BusinessNetworkTop = {
                ...row,
            };

            return networkTop;
        });
    }
}

export default BusinessNetworkRepository;
