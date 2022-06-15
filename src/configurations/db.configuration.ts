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

        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 5432;
        const username = process.env.DB_USERNAME || 'businessman';
        const password = process.env.DB_PASSWORD || 'mybusiness';
        const database = process.env.DB || 'business';

        const dataSource = new DataSource({
            type: 'postgres',
            host: host,
            port: Number(port),
            username: username,
            password: password,
            database: database,
            entities: [BusinessEntity, LedgerEntity, BusinessNetworkEntity],
            extra: {
                max: 10,
            },
        });

        const connection = await dataSource.initialize();
        this.connection = connection.manager;
        return this.connection;
    }
}

export default DbConfiguration;
