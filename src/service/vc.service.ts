import { LinkedCredential, TruvityClient, VcClaim, VcContext, VcDecorator, VcLinkedCredentialClaim, VcNotEmptyClaim} from '@truvity/sdk';
import { CredentialType, CredentialTypeMap, PassportRequest, PassportResponse, VcValidators } from '../credentials';
import { Claims } from '@truvity/sdk/documents/types';
import { ResourceCredential } from '@truvity/sdk/api';

const issuerClient = new TruvityClient({
    environment: "https://api.truvity.cloud",
    apiKey: "CLDdlOC7Y4AWC3HG0if6Z6jTucqQhYiYEdZ7CsY6uEvQwMhf3swVhJ-37hgPPckEc6-R7doTTmfVgRKqwIggXvywY7nI2bjEWvyj7kSut9J08yvE7W7MeTvzYdJms_8zHN2_hgU005jLVTp82a2ejSIT0f9fOokYqIaTj0yOgrhkuUhviUC7Nnytkik5fvKanjLhCGbnklfLXAvSUWfcDW2NEN6Ed9sx2X7D6LGQl65WBnhqtknPlUsABQKMuFMrQDA-b2zDxd1pDoMMEMmgC6h8pwqLYvDcRt8n-PK2qprUJIYsHEhnE2B5tspE5srr15jM-SaWtAVu0wcCejpVSQ",
});
console.log("issuerClient truvity initilized");

const receiverClient = new TruvityClient({
    environment: "https://api.truvity.cloud",
    apiKey: "EAIlilo9cKbeSYiX7W43qhMOVbyBNT06EtozXRTSqDP-zXS2EC4Zy1CgHgK-0dIrt5krwCmgzbLOsSY2KR1AJRv_YeCRQ9gxTAoZhdn-pfm93AnhRiFQJD3d9mfbvwLFaT1shC6cV4s9rV2BQdRA1dqysT9nmYqg-q2YDZxq5UfOC27QEZ-JePXYz7HkOq1XIRt8CJVHG6zHxTtw0K0fSXLWn4HDOFBqX3TEdIT1h9MsK7_7dFeS8iUOxDW26zk_DYHiN4cDxZWNNaJ6lJaNr9f04j4WwhqT33vIQ50X-sEggAhdqy45WrNExFd85itJ_sOFPII6MJ_1hI368RLYfA",
});
console.log("receiverClient truvity initilized");

type CredentialClassMap = {
    [key in CredentialType]: any; // Or a more specific type
};

const credentialClassMapRequest: CredentialClassMap = {
    passport: PassportRequest,
};

const credentialClassMapResponse: CredentialClassMap = {
    passport: PassportResponse,
};


 async function generateKey(client: TruvityClient) {
    return await client.keys.keyGenerate({
        data: { type: 'ED25519' }
    });
}

async function getIssuerDid() {
    return await issuerClient.dids.didDocumentSelfGet();
}

export async function requestVC<T extends CredentialType>(
    type: T,
    params: CredentialTypeMap[T]['params']
): Promise<void> {
    try {

        // Validate parameters using the appropriate validator
        const validator = VcValidators[type];
        validator(params as any);

        // Get the credential class
        const credentialClass = credentialClassMapRequest[type];

        // Get issuer DID
        const { id: issuerDid } = await getIssuerDid();
        console.log(`${type} Issuer DID:`, issuerDid);

        // Create VC decorator
        const vcDecorator = receiverClient.createVcDecorator(credentialClass);
        console.log(`${type} request VC created`);

        // Create draft
        const requestDraft = await vcDecorator.create({ claims: params });
        console.log(`${type} request draft created`);

        // Generate key and issue VC
        const receiverKey = await generateKey(receiverClient);
        console.log('Receiver key generated:', receiverKey.id);

        const requestVc = await requestDraft.issue(receiverKey.id);
        console.log(`${type} request VC issued`);

        // Send VC
        await requestVc.send(issuerDid, receiverKey.id);
        console.log(`${type} request VC sent to issuer`);
    } catch (error) {
        console.error(`Error during ${type} request:`, error);
        throw new Error(`Error during ${type} request: ${error.message}`);
    }
}

export async function getUnfulfilledRequest<T extends CredentialType>(
    type: T
): Promise<any[]> {

    // --- Issuer handles request ---
    const credentialClassRequest = credentialClassMapRequest[type];
    const credentialClassResponse = credentialClassMapResponse[type];

    // Instantiating document APIs
    const request = issuerClient.createVcDecorator(credentialClassRequest);
    const response = issuerClient.createVcDecorator(credentialClassResponse);

    // Searching for tickets purchase request VCs
    const purchaseRequestResults = await issuerClient.credentials.credentialSearch({
        filter: [
            {
                data: {
                    type: {
                        operator: 'IN',
                        values: [request.getCredentialTerm()],
                    },
                },
            },
        ],
    });
    console.log('Purchase requests found:', purchaseRequestResults.items.length);

// Searching for ticket purchase response VCs. We'll use it to calculate unprocessed requests
    const fulfilledRequests = await issuerClient.credentials.credentialSearch({
        filter: [
            {
                data: {
                    type: {
                        operator: 'IN',
                        values: [response.getCredentialTerm()],
                    },
                },
            },
        ],
    });
    console.log('Fulfilled requests found:', fulfilledRequests.items.length);

    // Calculating unprocessed requests
    const unfulfilledRequests = purchaseRequestResults.items.filter((request) => {
        const { linkedId: requestLinkedId } = LinkedCredential.normalizeLinkedCredentialId(request.id);

        const isLinkedToResponse = fulfilledRequests.items.some((response) =>
            response.data.linkedCredentials?.includes(requestLinkedId),
        );

        return !isLinkedToResponse;
    });
    console.log('Unfulfilled requests:', unfulfilledRequests.length);
    // console.log('Unfulfilled requests data :', unfulfilledRequests);
    return unfulfilledRequests;
}

export async function issueCredential<T extends CredentialType>(
    type: T, unfulfilledRequests: any[], keyId: string, request: VcDecorator<Claims>, response: VcDecorator<Claims>
): Promise<void> {
    // Processing new requests
    for (const item of unfulfilledRequests) {
        // Converting API resource to UDT to enable additional API for working with the content of the VC
            const requestVC = request.map(item);

            const responseDraft = await response.create({
                claims: {
                    request: requestVC,
                },
            });
            const responseVc = await responseDraft.issue(keyId);
            const presentation = await issuerClient.createVpDecorator().issue([responseVc], keyId);

        // Retrieving information about the issuer of the request. We'll use to send the response back
            const { issuer: requesterDid } = await requestVC.getMetaData();
            console.log('Requester DID:', requesterDid);

            await presentation.send(requesterDid, keyId);
            console.log('Response sent to:', requesterDid);
        }

}

export async function getIssuedCredential<T extends CredentialType>(
    type: T
): Promise<any[]> {
    // Processing new requests
    try {
        // --- Issuer handles request ---
        const credentialClassResponse = credentialClassMapResponse[type];

        // Instantiating document APIs
        const response = issuerClient.createVcDecorator(credentialClassResponse);
        const result = await receiverClient.credentials.credentialSearch({
            sort: [
                {
                field: 'DATA_VALID_FROM', // applying sort by date so that the newest ticket will be first
                    order: 'DESC',
                },
            ],
            filter: [
                {
                    data: {
                        type: {
                            operator: 'IN',
                            values: [response.getCredentialTerm()],
                        },
                    },
                },
            ],
        });
        console.log('getIssued Credential responses found:', result.items.length);
    //     console.log('getIssued Credential responses found:', result.items);

        const dataOnlyWithClaims = await Promise.all(
            result.items.map(async (item: ResourceCredential) => {
                const credentialResponseVc = response.map(item);
                const credentialClaims = await credentialResponseVc.getClaims();
                
                // Dereference and get claims specific to this item
                const purchasedTicketVc = await credentialClaims.request.dereference();
                const requestClaim = await purchasedTicketVc.getClaims();
        
                // Return the combined data
                return {
                    ...item.data,
                    requestClaim: requestClaim, // Add unique `requestClaim` to each item
                };
            })
        );
        return dataOnlyWithClaims;
    } catch (error) {
        console.error('Error during getIssuedCredential request:', error);
    }
}

export async function processCredentialRequest<T extends CredentialType>(
    type: T
): Promise<void>  {
    try {
        // --- Issuer handles request ---
        const credentialClassRequest = credentialClassMapRequest[type];
        const credentialClassResponse = credentialClassMapResponse[type];

        // Instantiating document APIs
        const request = issuerClient.createVcDecorator(credentialClassRequest);
        const response = issuerClient.createVcDecorator(credentialClassResponse);

         // Generate key and issue VC
        const issuerKey = await generateKey(issuerClient);
        console.log('Issuer key generated:', issuerKey.id);

        const unfulfilledRequests = await getUnfulfilledRequest(type);
        issueCredential(type, unfulfilledRequests, issuerKey.id, request, response);

    } catch (error) {
        console.error('Error during Issuer handling request:', error);
        throw new Error(`Error during ${type} request: ${error.message}`);
    }
}

// Export types for use in other files
export type {
    CredentialClassMap,
    CredentialType,
    CredentialTypeMap
};


// requestVC('passport', {
//     passportNumber: 'A123456',
//     issuingCountry: 'USA',
//     expiryDate: '2025-12-31'
// });

// processCredentialRequest('passport');




