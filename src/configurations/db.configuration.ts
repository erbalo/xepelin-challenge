import { singleton } from 'tsyringe';
import { DataSource, EntityManager } from 'typeorm';
import BusinessEntity from '../business-service/entities/business.entity';
import BusinessNetworkEntity from '../business-service/entities/business.network.entity';
import LedgerEntity from '../business-service/entities/ledger.entity';

@singleton()
class DbConfiguration {
    private connection: EntityManager;

    async getConnection(): Promise<EntityManager> {
        if (this.connection != null) {
            return this.connection;
        }

        const dataSource = new DataSource({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'businessman',
            password: 'mybusiness',
            database: 'business',
            entities: [BusinessEntity, LedgerEntity, BusinessNetworkEntity],
            logging: ['query', 'error'],
        });

        const connection = await dataSource.initialize();
        this.connection = connection.manager;
        return this.connection;
    }
}

export default DbConfiguration;
