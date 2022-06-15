import { inject, injectable } from 'tsyringe';
import { Business } from '../../business-service/representations/business.representation';
import { Logger as LoggerFactory } from '../../commons';
import RpcDispatcher from '../../shared/rpc.dispatcher';
import { InvoiceContext, Stage } from './stage';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class SaveBusinessStage extends Stage {
    private rpcDispatcher: RpcDispatcher;
    private queue: string;

    constructor(rpcDispatcher: RpcDispatcher, @inject('SaveBusinessQueue') queue: string) {
        super();
        this.rpcDispatcher = rpcDispatcher;
        this.queue = queue;
    }

    async execute(context: InvoiceContext): Promise<boolean> {
        const issuerBusiness = context.invoice.issuerId;
        const receiverBusiness = context.invoice.receiverId;

        if (issuerBusiness && receiverBusiness) {
            const issuerMessage = {
                business_id: issuerBusiness,
            };

            const receiverMessage = {
                business_id: receiverBusiness,
            };
            const savedIssuer = await this.rpcDispatcher.dispatch<object, Business>(issuerMessage, this.queue);
            const savedReciver = await this.rpcDispatcher.dispatch<object, Business>(receiverMessage, this.queue);

            if (!savedIssuer || !savedReciver) {
                Logger.error(
                    `Not possible to save one of the business issuer[${issuerBusiness}] or receiver[${receiverBusiness}]`,
                );
                return false;
            }

            return await this.checkNext(context);
        }

        return false;
    }
}

export default SaveBusinessStage;
