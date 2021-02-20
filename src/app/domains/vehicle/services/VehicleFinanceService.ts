import * as _ from 'lodash';
import { Container, Inject } from 'typedi';
import { Service } from 'typedi';
import { Code, HandleUpstreamError, Key, VehicleFinance } from '../../shared/models/models';
import { FileUploadService } from '../../shared/services/FileUploadService';
import { BusinessService } from '../../business/services/BusinessService';
import { VehicleFinanceCollectionService } from './collections/VehicleFinanceCollectionService';
import { VEHICLE_SERVICE_MESSAGES } from './VehicleService';

export enum VEHICLE_FINANCE_SERVICE_MESSAGES {
    EMPTY_VEHICLE_KEY = 'VEHICLE_FINANCE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY',
    PURCHASE_NOT_FOUND = 'VEHICLE_FINANCE_SERVICE_MESSAGES.PURCHASE_NOT_FOUND',
    PURCHASE_NOT_ADDED = 'VEHICLE_FINANCE_SERVICE_MESSAGES.PURCHASE_NOT_ADDED',
    PURCHASE_NOT_UPDATED = 'VEHICLE_FINANCE_SERVICE_MESSAGES.PURCHASE_NOT_UPDATED',
    EXISTING_PURCHASE = 'VEHICLE_FINANCE_SERVICE_MESSAGES.EXISTING_PURCHASE',
    EMPTY_PURCHASE_KEY = 'VEHICLE_FINANCE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY',
    EMPTY_NEW_PURCHASE_INFO = 'VEHICLE_FINANCE_SERVICE_MESSAGES.EMPTY_NEW_PURCHASE_INFO'
}

/**
 * Key values that will be converted
 * both on request and response
 */
export const vehicleFinanceMappingKeys = {
    date: [
        'originated',
        'created',
        'modified'
    ],
    price: [
        'originalLoan',
        'currentPrincipal',
        'paymentAmount',
    ]
};

@Service()
export class VehicleFinanceService {

    @Inject()
    private businessService: BusinessService = Container.get(BusinessService);

    @Inject()
    private vehicleFinanceCollectionService: VehicleFinanceCollectionService = Container.get(VehicleFinanceCollectionService);

    @Inject()
    private fileUploadService: FileUploadService = Container.get(FileUploadService);

    /**
     * Get finance by key
     *
     * @param financeKey
     * @param host
     */
    public async getFinance(financeKey: Key, host?: string): Promise<any> {
        if (!financeKey) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY);
        }

        const finance = await this.vehicleFinanceCollectionService.findOne({ key: { $eq: financeKey }});

        if (!finance) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.PURCHASE_NOT_FOUND);
        }

        return await this.addDependencies(finance, host);
    }

    /**
     * Get all finances
     *
     * @param host
     */
    public async getFinances(host?: string): Promise<any> {
        const finances = await this.vehicleFinanceCollectionService.getAll();

        if (finances.length === 0) {
            return [];
        }

        return await Promise.all(finances.map(async (finance) => {
            return await this.addDependencies(finance, host);
        }));
    }

    /**
     * Get finance by vehicle key
     *
     * @param vehicleKey
     * @param host
     */
    public async getFinanceByVehicle(vehicleKey: Key, host?: string): Promise<any> {
        if (!vehicleKey) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.EMPTY_VEHICLE_KEY);
        }

        const finance = await this.vehicleFinanceCollectionService.findOne({ vehicleKey: { $eq: vehicleKey }});

        if (!finance) {
            return {};
        }

        return await this.addDependencies(finance, host);
    }

    /**
     * Add finance
     *
     * @param vehicleKey
     * @param finance
     * @param host
     */
    public async addFinance(vehicleKey: Key, finance: any, host?: string): Promise<any> {
        if (!finance) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.EMPTY_NEW_PURCHASE_INFO);
        }

        const financeExists = await this.vehicleFinanceCollectionService.findOne({ vehicleKey: { $eq: vehicleKey }});

        if (financeExists) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.EXISTING_PURCHASE);
        }

        const results = await this.vehicleFinanceCollectionService.add(vehicleKey, finance);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.PURCHASE_NOT_ADDED);
        }

        return await this.addDependencies(results, host);
    }

    /**
     * Update finance
     *
     * @param financeKey
     * @param finance
     * @param host
     */
    public async updateFinance(financeKey: Key, finance: any, host?: string): Promise<any> {
        if (!financeKey) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY);
        }

        const results = await this.vehicleFinanceCollectionService.update(financeKey, finance);

        if (!results) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.PURCHASE_NOT_UPDATED);
        }

        return await this.addDependencies(results, host);
    }

    /**
     * Delete finance
     *
     * @param financeKey
     */
    public async deleteFinance(financeKey: Key): Promise<any> {
        if (!financeKey) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.EMPTY_PURCHASE_KEY);
        }

        const finance = await this.vehicleFinanceCollectionService.findOne({ key: { $eq: financeKey } });

        if (!finance) {
            throw new HandleUpstreamError(VEHICLE_FINANCE_SERVICE_MESSAGES.PURCHASE_NOT_FOUND);
        }

        await this.vehicleFinanceCollectionService.removeByFieldValue('key', financeKey);

        return finance;
    }

    /**
     * Dependencies when returning object
     *
     * @param finance
     * @param host
     * @private
     */
    private async addDependencies(finance: any, host?: string): Promise<any> {
        return {
            ...finance,
            business: await this.businessService.getBusiness(finance.businessKey),
            filePath: this.fileUploadService.setFilePath(finance.agreement, host)
        };
    }
}
