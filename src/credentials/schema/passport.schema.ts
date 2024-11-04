import { LinkedCredential, VcContext, VcLinkedCredentialClaim, VcNotEmptyClaim } from '@truvity/sdk';

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

@VcContext({
    name: 'PassportResponse',
    namespace: 'urn:dif:hackathon/vocab/identity',
})
export class PassportResponse {
    @VcNotEmptyClaim
    @VcLinkedCredentialClaim(PassportRequest)
    request!: LinkedCredential<PassportRequest>;

    @VcNotEmptyClaim
    passportNumber!: string;

    @VcNotEmptyClaim
    issuingCountry!: string;

    @VcNotEmptyClaim
    expiryDate!: string;
}