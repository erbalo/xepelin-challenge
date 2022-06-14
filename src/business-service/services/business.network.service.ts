import moment from 'moment';
import { injectable } from 'tsyringe';
import { Logger as LoggerFactory } from '../../commons';
import { Invoice } from '../../invoice-service/representations/invoice';
import BusinessNetworkEntity from '../entities/business.network.entity';
import BusinessNetworkRepository from '../repositories/business.network.repository';
import BusinessRepository from '../repositories/business.repository';
import { BusinessNetworkOperation, BusinessNetworkTop, NetworkOperation } from '../representations/business.network.representation';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class BusinessNetworkService {
    private businessNetworkRepository: BusinessNetworkRepository;
    private businessRepository: BusinessRepository;

    constructor(businessNetworkRepository: BusinessNetworkRepository, businessRepository: BusinessRepository) {
        this.businessNetworkRepository = businessNetworkRepository;
        this.businessRepository = businessRepository;
    }

    async buildNetworkFrom(invoice: Invoice) {
        const issuerNetwork: BusinessNetworkOperation = {
            businessId: invoice.issuerId,
            businessRelationId: invoice.receiverId,
            date: this.extractYearMonth(invoice.paymentDate),
            type: NetworkOperation.ISSUED,
        };

        const receiverNetwork: BusinessNetworkOperation = {
            businessId: invoice.receiverId,
            businessRelationId: invoice.issuerId,
            date: this.extractYearMonth(invoice.paymentDate),
            type: NetworkOperation.RECEIVED,
        };

        const issuerBusiness = await this.businessRepository.getBy(issuerNetwork.businessId);
        const receiverBusiness = await this.businessRepository.getBy(receiverNetwork.businessId);

        if (issuerBusiness && receiverBusiness) {
            await this.applyNetworkOperation(issuerNetwork);
            await this.applyNetworkOperation(receiverNetwork);
        } else {
            Logger.error(
                `Business from issuer[${issuerNetwork.businessId}] or receiver[${receiverNetwork.businessId}] not exists, from the invoice [${invoice.id}]`,
            );
        }
    }

    async topNetwork(limit = 5): Promise<BusinessNetworkTop[]> {
        return await this.businessNetworkRepository.topNetwork(limit);
    }

    async applyNetworkOperation(operation: BusinessNetworkOperation): Promise<BusinessNetworkEntity> {
        Logger.info('Network operation to save:', JSON.stringify(operation));
        return await this.businessNetworkRepository.apply(operation);
    }

    private extractYearMonth(date: Date): Date {
        const safetyConvert = new Date(date);
        const dateMarshall = moment(safetyConvert.setDate(1)).startOf('day').utcOffset(safetyConvert.toISOString()).format('YYYY-MM-DDTHH:mm');
        const formatted = new Date(dateMarshall);
        return new Date(formatted);
    }
}

export default BusinessNetworkService;
