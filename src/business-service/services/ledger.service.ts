import { injectable } from 'tsyringe';
import { Logger as LoggerFactory } from '../../commons';
import { Invoice } from '../../invoice-service/representations/invoice';
import LedgerEntity from '../entities/ledger.entity';
import LedgerMapper from '../mappers/ledger.mapper';
import BusinessRepository from '../repositories/business.repository';
import LedgerRepository from '../repositories/ledger.repository';
import { Currency } from '../representations/currency.representation';
import { LedgerOperation, LedgerType } from '../representations/ledger.representation';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class LedgerService {
    private ledgerRepository: LedgerRepository;
    private ledgerMapper: LedgerMapper;
    private businessRepository: BusinessRepository;

    constructor(ledgerRepository: LedgerRepository, ledgerMapper: LedgerMapper, businessRepository: BusinessRepository) {
        this.ledgerRepository = ledgerRepository;
        this.ledgerMapper = ledgerMapper;
        this.businessRepository = businessRepository;
    }

    async applyFrom(invoice: Invoice): Promise<void> {
        const issuerOperation: LedgerOperation = {
            businessId: invoice.issuerId,
            amount: invoice.amount,
            currency: Currency.USD,
            invoiceId: invoice.id,
            paymentDate: invoice.paymentDate,
            type: LedgerType.INCOME,
        };

        const receiverOperation: LedgerOperation = {
            businessId: invoice.receiverId,
            amount: invoice.amount,
            currency: Currency.USD,
            invoiceId: invoice.id,
            paymentDate: invoice.paymentDate,
            type: LedgerType.OUTCOME,
        };

        const issuerBusiness = await this.businessRepository.getBy(issuerOperation.businessId);
        const receiverBusiness = await this.businessRepository.getBy(receiverOperation.businessId);

        if (issuerBusiness && receiverBusiness) {
            await this.applyOperation(issuerOperation);
            await this.applyOperation(receiverOperation);
        } else {
            Logger.error(
                `Business from issuer[${issuerOperation.businessId}] or receiver[${receiverOperation.businessId}] not exists, from the invoce [${invoice.id}]`,
            );
        }
    }

    async applyOperation(ledgerOperation: LedgerOperation): Promise<LedgerEntity> {
        const entity = this.ledgerMapper.fromDto(ledgerOperation);
        const operation = await this.ledgerRepository.save(entity);
        return operation;
    }
}

export default LedgerService;
