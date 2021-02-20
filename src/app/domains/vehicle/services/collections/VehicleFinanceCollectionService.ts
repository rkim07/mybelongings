import { Service } from 'typedi';
import { Key, VehicleFinance } from '../../../shared/models/models';
import { Datetime } from '../../../shared/models/utilities/Datetime';
import { DatabaseCollectionService } from '../../../shared/services/DatabaseCollectionService';

@Service()
export class VehicleFinanceCollectionService extends DatabaseCollectionService {

    /**
     * Constructor
     */
    constructor() {
        super('VehicleFinance');
    }

    /**
     * Get all finances sorted
     */
    public async getAll(): Promise<any> {
        await this.loadCollection();

        return this.collection.chain()
            .find()
            .simplesort('created', false)
            .data();
    }

    /**
     * Add finance
     *
     * @param vehicleKey
     * @param finance
     */
    public async add(vehicleKey: Key, finance: any): Promise<any> {
        await this.loadCollection();

        return await this.addOne(
            new VehicleFinance({
                vehicleKey: vehicleKey,
                businessKey: finance.businessKey,
                accountNumber: finance.accountNumber,
                originalLoan: finance.originalLoan,
                currentPrincipal: finance.currentPrincipal,
                paymentAmount: finance.paymentAmount,
                interestRate: finance.interestRate,
                term: finance.term,
                originated: finance.originated,
                financed: finance.financed
            })
        );
    }

    /**
     * Update finance
     *
     * @param financeKey
     * @param finance
     */
    public async update(financeKey: Key, finance: any): Promise<any> {
        await this.loadCollection();

        const existingFinance = await this.findOne({ key: { $eq: financeKey } });

        if (existingFinance) {
            return await this.updateManyFields({
                uniqueField: 'key',
                uniqueFieldValue: existingFinance.key,
                updateFields: {
                    vehicleKey: finance.vehicleKey,
                    businessKey: finance.businessKey,
                    accountNumber: finance.accountNumber,
                    originalLoan: finance.originalLoan,
                    currentPrincipal: finance.currentPrincipal,
                    paymentAmount: finance.paymentAmount,
                    interestRate: finance.interestRate,
                    term: finance.term,
                    originated: finance.originated,
                    modified: Datetime.getNow()
                }
            });
        }
    }
}
