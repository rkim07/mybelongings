import { User } from '../models/models';

export interface Requestor {
  ipAddress: string;
  referrer: string;
  language: string;
  user?: User;
}
