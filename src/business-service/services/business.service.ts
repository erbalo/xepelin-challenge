import { injectable } from 'tsyringe';
import BusinessEntity from '../entities/business.entity';
import BusinessRepository from '../repositories/business.repository';

@injectable()
class BusinessService {
    private businessRepository: BusinessRepository;

    constructor(businessRepository: BusinessRepository) {
        this.businessRepository = businessRepository;
    }

    async save(businessId: number): Promise<BusinessEntity> {
        const business = await this.businessRepository.getBy(businessId);

        if (business) {
            return business;
        }

        return await this.businessRepository.save(businessId);
    }
}

export default BusinessService;
