import { NextFunction, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { ReportFrequency, ReportOperation } from '../../business-service/representations/ledger.representation';
import BusinessService from '../../business-service/services/business.service';
import LedgerService from '../../business-service/services/ledger.service';
import { BadRequestError } from '../../commons';

@autoInjectable()
class BusinessController {
    private businessService: BusinessService;
    private ledgerService: LedgerService;

    constructor(businessService: BusinessService, ledgerService: LedgerService) {
        this.businessService = businessService;
        this.ledgerService = ledgerService;
    }

    summary = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { from_date: fromDate = new Date(), quantity = 5 } = req.query;
        const { frequency = ReportFrequency.DAYS } = req.query;
        const freq: ReportFrequency = <ReportFrequency>frequency.toString();

        const businessId = Number(id);
        if (!id || id.length == 0 || isNaN(businessId)) {
            throw new BadRequestError('Business id is mandatory');
        }

        const operation: ReportOperation = {
            fromDate: new Date(fromDate.toString()),
            quantity: Number(quantity),
            frequency: freq,
        };

        const sumary = await this.ledgerService.retriveSummary(businessId, operation);

        return res.send({
            status: 200,
            data: sumary,
        });
    };
}

export default BusinessController;
