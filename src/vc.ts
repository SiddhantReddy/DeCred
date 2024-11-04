import { LinkedCredential, TruvityClient, VcClaim, VcContext, VcDecorator, VcLinkedCredentialClaim, VcNotEmptyClaim} from '@truvity/sdk';
import { CredentialType, CredentialTypeMap, PassportRequest, PassportResponse, VcValidators } from './credentials';
import { Claims } from '@truvity/sdk/documents/types';

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


// async function createApiKey() {
//     const response = await client.apiKeys.apiKeyCreate({
//       body:  {
//         labels: {
//             "entityName": "testEntity",
//         }
//     }
//     });
  
//     // Do something with the response
//     console.log("createApiKey response:: ", response);
//   }

// async function searchApiKey() {
// const response = await client.apiKeys.apiKeySearch({
//     filter: [
//         {
//             labels: [
//                 {
//                     operator: 'EQUAL',
//                     key: 'entityName',
//                     value: 'testEntity'
//                 }
//             ]
//         }
//     ]
// });

// response.items.forEach(item => {
//     console.log("ID:", item.id);
//     console.log("Labels:");
//     Object.entries(item.labels).forEach(([key, value]) => {
//       console.log(`  - ${key}: ${value}`);
//     });
//     console.log("Data:");
//     Object.entries(item.data).forEach(([key, value]) => {
//       console.log(`  - ${key}: ${value}`);
//     });
//     console.log("--------------------");
//   });
// }

// async function getDidDocument() {
//     const response1 = await client.dids.didDocumentSelfGet();
//     console.log("response1 response1:: ", response1);

//     const response = await client.desk.didDocumentGet("5984ffd5-2d08-4167-849c-47fe87ff9adc", {});

//     //id: 'did:web:ssi.truvity.cloud:99542191-41a2-4154-95f8-6aad662c9050',
  
//     console.log("getDidDocument response:: ", response);
//   }
  
// async function generateCryptoKey(client: TruvityClient) {
//     const key1 = await client.keys.keyGenerate({
//         data: {
//             type: 'ED25519',
//         },
//     });
//     console.log("generateCryptoKey response:: ", key1);
// }

  
// createApiKey();
// searchApiKey();
// getDidDocument();
// generateCryptoKey();

// console.log("ticket :: ", tic);
// console.log("ticket res :: ", tres);


// --- Documents schemas ---
@VcContext({
    name: 'TicketPurchaseRequest',
    namespace: 'urn:dif:hackathon/vocab/airline',
})
class TicketPurchaseRequest {
    @VcNotEmptyClaim
    firstName!: string;

    @VcNotEmptyClaim
    lastName!: string;
}

@VcContext({
    name: 'Ticket',
    namespace: 'urn:dif:hackathon/vocab/airline',
})
class PurchasedTicked {
    @VcNotEmptyClaim
    flightNumber!: string;
}

@VcContext({
    name: 'TicketPurchaseResponse',
    namespace: 'urn:dif:hackathon/vocab/airline',
})
class PurchaseResponse {
    @VcNotEmptyClaim
    @VcLinkedCredentialClaim(TicketPurchaseRequest)
    request!: LinkedCredential<TicketPurchaseRequest>;

    @VcNotEmptyClaim
    @VcLinkedCredentialClaim(PurchasedTicked)
    ticket!: LinkedCredential<PurchasedTicked>;

    @VcNotEmptyClaim
    price!: number;
}

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

async function requestVC<T extends CredentialType>(
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
    }
}

async function getUnfulfilledRequest<T extends CredentialType>(
    type: T, request: VcDecorator<Claims>, response: VcDecorator<Claims>,
): Promise<any[]> {

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

async function issueCredential<T extends CredentialType>(
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

async function processCredentialRequest<T extends CredentialType>(
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

        const unfulfilledRequests = await getUnfulfilledRequest(type, request, response);
        issueCredential(type, unfulfilledRequests, issuerKey.id, request, response);

    } catch (error) {
        console.error('Error during Issuer handling request:', error);
    }
//     try {
//         // Tim handles the received request

//         const purchaseResponse = receiverClient.createVcDecorator(PurchaseResponse);

//         const result = await receiverClient.credentials.credentialSearch({
//             sort: [
//                 {
//                 field: 'DATA_VALID_FROM', // applying sort by date so that the newest ticket will be first
//                     order: 'DESC',
//                 },
//             ],
//             filter: [
//                 {
//                     data: {
//                         type: {
//                             operator: 'IN',
//                             values: [purchaseResponse.getCredentialTerm()],
//                         },
//                     },
//                 },
//             ],
//         });
//         console.log('Purchase responses found:', result.items.length);

//     // Converting the first API resource from the search result to UDT to enable additional API for working with the content of the VC
//         const purchaseResponseVc = purchaseResponse.map(result.items[0]);
//         const responseClaims = await purchaseResponseVc.getClaims();

//     // Dereferencing the link to a credential to enable working with its content
//         const purchasedTicketVc = await responseClaims.ticket.dereference();
//         const ticketClaims = await purchasedTicketVc.getClaims();

//     // Completing the demo
//         console.info(`Last ticket flight number: ${ticketClaims.flightNumber} (price: $${responseClaims.price})`);
//     } catch (error) {
//         console.error('Error during Tim handles request:', error);
//     }
}


// requestVC('passport', {
//     passportNumber: 'A123456',
//     issuingCountry: 'USA',
//     expiryDate: '2025-12-31'
// });

processCredentialRequest('passport');




