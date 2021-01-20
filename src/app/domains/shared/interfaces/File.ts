import {Key} from "../models/utilities/Key";

export interface File {
    fieldname: string;
    originalname: string;
    name: string;
    encoding: string;
    mimetype: string;
    path: string;
    extension: string;
    size: number
    truncated: boolean;
    buffer: string;
}
