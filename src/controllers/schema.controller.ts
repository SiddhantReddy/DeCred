import { Request, Response, RequestHandler } from 'express';
import { schemaService } from '../service/schema.service';
import { CredentialType } from '../credentials';

interface SchemaRequestParams {
    type: CredentialType;
}
// Define available credential types
export const ORGANISATION_TYPES = [
    [
        {
          "id": "visa",
          "name": "Visa Authority, India",
          "type": "Government"
        },
        {
          "id": "passport",
          "name": "Passport Authority, India",
          "type": "Government"
        },
        {
            "id": "truvity",
            "name": "Truvity",
            "type": "Private"  
          },
          {
            "id": "aadhar",
            "name": "Aadhar authority, India",
            "type": "Government" 
          },
          {
            "id": "minicipality",
            "name": "Municipality of Bengaluru, India",
            "type": "Government" 
          }
      ]
] as const;

export const schemaController = {

    getOrganisationTypes: (async (
        _req: Request,
        res: Response
    ): Promise<void> => {
        try {
            res.status(200).json({
                success: true,
                data: {
                    types: ORGANISATION_TYPES
                }
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({
                success: false,
                message
            });
        }
    }) as RequestHandler,

    getCredentialSchema: (async (
        req: Request<SchemaRequestParams>,
        res: Response
    ): Promise<void> => {
        try {
            const { type } = req.params;
            const schema = await schemaService.getCredentialSchema(type);

            if (!schema) {
                res.status(404).json({
                    success: false,
                    message: `Schema not found for credential type: ${type}`
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: schema
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(400).json({
                success: false,
                message
            });
        }
    }) as RequestHandler<SchemaRequestParams>,

    validateCredentialParams: (async (
        req: Request<SchemaRequestParams>,
        res: Response
    ): Promise<void> => {
        try {
            const { type } = req.params;
            const params = req.body;

            const validationResult = await schemaService.validateCredentialParams(type, params);

            if (!validationResult.valid) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid parameters',
                    errors: {
                        missing: validationResult.missing,
                        invalid: validationResult.invalid
                    }
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Parameters are valid'
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({
                success: false,
                message
            });
        }
    }) as RequestHandler<SchemaRequestParams>
};