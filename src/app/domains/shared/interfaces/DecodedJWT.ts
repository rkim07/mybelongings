export interface DecodedJWT {
    authorities: Array<string>;
    created: string;
    key: string;
    seatCol: string;
    seatNumber: string;
    seatRow: number;
    iat: number;
    iss: string;
}
