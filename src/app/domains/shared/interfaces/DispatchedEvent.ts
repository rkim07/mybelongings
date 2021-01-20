import { Datetime } from '../models/models';

export interface DispatchedEvent {
    eventType: string;
    eventTime: Datetime;
    payload: any;
}
