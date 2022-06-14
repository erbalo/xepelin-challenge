export enum NetworkOperation {
    ISSUED = 'ISSUED',
    RECEIVED = 'RECEIVED',
}

export interface BusinessNetworkSearch {
    businessId: number;
    businessRelationId: number;
    reportingDate: Date;
}

export interface BusinessNetworkOperation {
    businessId: number;
    businessRelationId: number;
    date: Date;
    type: NetworkOperation;
}

export interface BusinessNetworkTop {
    business_id: number;
    total_relationship: number;
}
