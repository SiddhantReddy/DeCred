import { VcContext, VcNotEmptyClaim, VcLinkedCredentialClaim, LinkedCredential } from '@truvity/sdk';

// Types for our credential configurations
interface CredentialField {
  name: string;
  type: string;
  annotations: string[];
  linkedCredential?: string;
}

interface CredentialConfig {
  name: string;
  namespace: string;
  fields: CredentialField[];
}

// Function to generate the class definition string
function generateCredentialClass(config: CredentialConfig): string {
  const decorators = `@VcContext({
    name: '${config.name}',
    namespace: '${config.namespace}',
})`;
  
  const fields = config.fields.map(field => {
    const annotations = field.annotations.map(annotation => `    @${annotation}`).join('\n');
    const linkedCredential = field.linkedCredential ? 
      `LinkedCredential<${field.linkedCredential}>` : 
      field.type;
    
    return `${annotations}
    ${field.name}!: ${linkedCredential};`;
  }).join('\n\n');

  return `${decorators}
class ${config.name} {
${fields}
}`;
}

// Function to evaluate and create the class
function createCredentialClass(config: CredentialConfig): any {
    const classDefinition = generateCredentialClass(config);
    return `
      ${classDefinition}
    `;
  }
// Example configurations
const credentialConfigs = {
  passport: {
    name: 'Passport',
    namespace: 'urn:dif:hackathon/vocab/identity',
    fields: [
      {
        name: 'passportNumber',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      },
      {
        name: 'issuingCountry',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      },
      {
        name: 'expiryDate',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      }
    ]
  },
  visa: {
    name: 'Visa',
    namespace: 'urn:dif:hackathon/vocab/immigration',
    fields: [
      {
        name: 'visaNumber',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      },
      {
        name: 'visaType',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      },
      {
        name: 'linkedPassport',
        type: 'LinkedCredential',
        annotations: ['VcNotEmptyClaim', 'VcLinkedCredentialClaim(Passport)'],
        linkedCredential: 'Passport'
      }
    ]
  },
  experienceLetter: {
    name: 'ExperienceLetter',
    namespace: 'urn:dif:hackathon/vocab/employment',
    fields: [
      {
        name: 'companyName',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      },
      {
        name: 'duration',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      },
      {
        name: 'position',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      },
      {
        name: 'employeeDetails',
        type: 'LinkedCredential',
        annotations: ['VcNotEmptyClaim', 'VcLinkedCredentialClaim(Passport)'],
        linkedCredential: 'Passport'
      }
    ]
  },
  ticketPurchaseRequest: {
    name: 'TicketPurchaseRequest',
    namespace: 'urn:dif:hackathon/vocab/airline',
    fields: [
      {
        name: 'firstName',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      },
      {
        name: 'lastName',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      }
    ]
  },
  ticket: {
    name: 'Ticket',
    namespace: 'urn:dif:hackathon/vocab/airline',
    fields: [
      {
        name: 'flightNumber',
        type: 'string',
        annotations: ['VcNotEmptyClaim']
      }
    ]
  },
  ticketPurchaseResponse: {
    name: 'TicketPurchaseResponse',
    namespace: 'urn:dif:hackathon/vocab/airline',
    fields: [
      {
        name: 'request',
        type: 'LinkedCredential',
        annotations: ['VcNotEmptyClaim', 'VcLinkedCredentialClaim(TicketPurchaseRequest)'],
        linkedCredential: 'TicketPurchaseRequest'
      },
      {
        name: 'ticket',
        type: 'LinkedCredential',
        annotations: ['VcNotEmptyClaim', 'VcLinkedCredentialClaim(Ticket)'],
        linkedCredential: 'Ticket'
      },
      {
        name: 'price',
        type: 'number',
        annotations: ['VcNotEmptyClaim']
      }
    ]
  }
};

// Usage example
export function generateCredentialClasses(types: string[]): any[] {
  return types.map(type => {
    const config = credentialConfigs[type];
    console.log("config :: ", config);
    if (!config) {
      throw new Error(`Unknown credential type: ${type}`);
    }
    return createCredentialClass(config);
  });
}

// Example of how to use it with your existing code
async function createCredentialInstance(client: any, credentialClass: any, data: any) {
  const decorator = client.createVcDecorator(credentialClass);
  const draft = await decorator.create({
    claims: data,
  });
  return draft;
}