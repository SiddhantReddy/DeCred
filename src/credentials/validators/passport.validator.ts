import { PassportParams } from '../types';

export class PassportValidator {
    static validate(params: PassportParams): boolean {
        if (!params.passportNumber || params.passportNumber.length < 6) {
            throw new Error('Invalid passport number');
        }
        if (!params.issuingCountry || params.issuingCountry.length < 2) {
            throw new Error('Invalid issuing country');
        }
        if (!params.expiryDate || Date.parse(params.expiryDate) <= Date.now()) {
            throw new Error('Invalid or expired date');
        }
        return true;
    }
}