import { VcContext, VcNotEmptyClaim } from '@truvity/sdk';

@VcContext({
    name: 'PassportRequest',
    namespace: 'urn:dif:hackathon/vocab/identity',
})
export class PassportRequest {
    @VcNotEmptyClaim
    passportNumber!: string;

    @VcNotEmptyClaim
    issuingCountry!: string;

    @VcNotEmptyClaim
    expiryDate!: string;
}