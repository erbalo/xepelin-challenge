import { inject, injectable } from 'tsyringe';
import { Logger as LoggerFactory } from '../../commons';
import { Invoice } from '../../invoice-service/representations/invoice';
import RpcDispatcher from '../../shared/rpc.dispatcher';
import { InvoiceContext, Stage } from './stage';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class SaveInvoiceStage extends Stage {
    private rpcDispatcher: RpcDispatcher;
    private queue: string;

    constructor(rpcDispatcher: RpcDispatcher, @inject('SaveInvoiceQueue') queue: string) {
        super();
        this.rpcDispatcher = rpcDispatcher;
        this.queue = queue;
    }

    async execute(context: InvoiceContext): Promise<boolean> {
        try {
            const savedInvoice = await this.rpcDispatcher.dispatch<Invoice, Invoice>(context.invoice, this.queue);
            console.log(savedInvoice);

            if (savedInvoice) {
                return await this.checkNext(context);
            }
        } catch (err) {
            Logger.error('Details', err.message);
        }

        return false;
    }
}

export default SaveInvoiceStage;
