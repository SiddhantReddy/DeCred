import { Request, Response } from 'express';
import { CredentialType } from '../credentials';
import { requestVC, processCredentialRequest, getUnfulfilledRequest, getIssuedCredential } from '../service/vc.service';

export const vcController = {
    // Request a new VC
    requestVC: async (req: Request, res: Response) => {
        try {
            const type = req.params.type as CredentialType;
            const params = req.body;
            console.log("RequestVC: Request Params", params);

            await requestVC(type, params);
            
            res.status(200).json({
                success: true,
                message: `${type} VC request processed successfully`
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || `Error processing ${req.params.type} VC request`
            });
        }
    },

    // Process credential requests
    processCredentialRequest: async (req: Request, res: Response) => {
        try {
            const type = req.params.type as CredentialType;
            console.log("processCredentialRequest: Request type", type);
            await processCredentialRequest(type, null);
            
            res.status(200).json({
                success: true,
                message: `${type} credentials processed successfully`
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || `Error processing ${req.params.type} credentials`
            });
        }
    },

    // Process credential request by id
    processCredentialRequestById: async (req: Request, res: Response) => {
        try {
            const type = req.params.type as CredentialType;
            const id = req.params.id;
            console.log("processCredentialRequestId: Request type and Id", type, id);
            await processCredentialRequest(type, id);
            
            res.status(200).json({
                success: true,
                message: `${type} credentials processed successfully`
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || `Error processing ${req.params.type} credentials`
            });
        }
    },

    // Get unfulfilled requests
    getUnfulfilledRequests: async (req: Request, res: Response) => {
        try {
            const type = req.params.type as CredentialType;
            const id = req.params.id;
            
            const unfulfilledRequests = await getUnfulfilledRequest(type, id);
            
            res.status(200).json({
                success: true,
                data: unfulfilledRequests,
                count: unfulfilledRequests.length
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || `Error getting unfulfilled ${req.params.type} requests`
            });
        }
    },

    // Get unfulfilled requests
    serachCredential: async (req: Request, res: Response) => {
        try {
            const type = req.params.type as CredentialType;     
            const credentials = await getIssuedCredential(type);
            
            res.status(200).json({
                success: true,
                data: credentials,
                count: credentials.length
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message || `Error getting unfulfilled ${req.params.type} requests`
            });
        }
    }
};
