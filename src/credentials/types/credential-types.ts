// types.ts
import { LinkedCredential } from '@truvity/sdk';
import { PassportRequest } from '../schema';

export type PassportParams = {
    passportNumber: string;
    issuingCountry: string;
    expiryDate: string;
};

export type VisaParams = {
    visaNumber: string;
    visaType: string;
    passport: LinkedCredential<PassportRequest>;
};

export type ExperienceLetterParams = {
    companyName: string;
    position: string;
    duration: string;
};

export type CredentialType = 'passport';

export interface CredentialTypeMap {
    passport: {
        class: typeof PassportRequest;
        params: PassportParams;
    };
}