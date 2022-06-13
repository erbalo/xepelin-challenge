import { singleton } from 'tsyringe';
import { Mapper } from '../../commons';
import LedgerEntity from '../entities/ledger.entity';
import { LedgerOperation } from '../representations/ledger.representation';

@singleton()
class LedgerMapper extends Mapper<LedgerOperation, LedgerEntity> {
    fromDto(operation: LedgerOperation): LedgerEntity {
        const entity = new LedgerEntity();
        entity.amount = operation.amount;
        entity.businessId = operation.businessId;
        entity.currency = operation.currency;
        entity.invoiceId = operation.invoiceId;
        entity.paymentDate = operation.paymentDate;
        entity.type = operation.type;

        return entity;
    }

    fromEntity(entity: LedgerEntity): LedgerOperation {
        const operation: LedgerOperation = {
            ...entity,
        };

        return operation;
    }
}

export default LedgerMapper;
