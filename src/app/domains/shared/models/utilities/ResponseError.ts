export class ResponseError extends Error {

    statusCode: number;
    errorCode: string;
    message: string;

    constructor(statusCode: number, errorCode: string, message: string) {
        super();
        Object.setPrototypeOf(this, ResponseError.prototype);
        
        if (statusCode)
            this.statusCode = statusCode;
        if (errorCode)
            this.errorCode = errorCode;
        if (message)
            this.message = message;

        this.stack = new Error().stack;
    }

}
