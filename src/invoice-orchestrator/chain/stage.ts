import { Business } from '../../business-service/representations/business.representation';
import { Invoice } from '../../invoice-service/representations/invoice';

export interface InvoiceContext {
    invoice: Invoice;
    issuerBusiness?: Business;
    receiverBusiness?: Business;
}

export abstract class Stage {
    private next: Stage;

    linkWith(next: Stage): Stage {
        this.next = next;
        return next;
    }

    abstract execute(context: InvoiceContext): Promise<boolean>;

    protected async checkNext(context: InvoiceContext): Promise<boolean> {
        if (this.next == null) {
            return true;
        }

        return await this.next.execute(context);
    }
}
