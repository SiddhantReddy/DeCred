import { CredentialType} from '../credentials';

interface FieldDefinition {
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: any;
}

interface SchemaDefinition {
    type: string;
    fields: FieldDefinition[];
    description: string;
}

const credentialSchemas: Record<CredentialType, SchemaDefinition> = {
    passport: {
        type: 'passport',
        description: 'Passport verification credential schema',
        fields: [
            {
                name: 'passportNumber',
                type: 'string',
                required: true,
                description: 'Unique passport identification number',
                example: 'A123456'
            },
            {
                name: 'issuingCountry',
                type: 'string',
                required: true,
                description: 'Country that issued the passport',
                example: 'USA'
            },
            {
                name: 'expiryDate',
                type: 'string',
                required: true,
                description: 'Passport expiration date (YYYY-MM-DD)',
                example: '2025-12-31'
            }
        ]
    }
};

export const schemaService = {
    getCredentialSchema(type: CredentialType): SchemaDefinition | null {
        return credentialSchemas[type] || null;
    },

    validateCredentialParams(type: CredentialType, params: any): { 
        valid: boolean; 
        missing?: string[]; 
        invalid?: string[] 
    } {
        const schema = credentialSchemas[type];
        if (!schema) return { valid: false, invalid: ['Invalid credential type'] };

        const missing: string[] = [];
        const invalid: string[] = [];

        schema.fields.forEach(field => {
            if (field.required && !(field.name in params)) {
                missing.push(field.name);
            }
            // Add basic type validation
            if (field.name in params) {
                if (field.type === 'string' && typeof params[field.name] !== 'string') {
                    invalid.push(field.name);
                }
            }
        });

        return {
            valid: missing.length === 0 && invalid.length === 0,
            ...(missing.length > 0 && { missing }),
            ...(invalid.length > 0 && { invalid })
        };
    }
};