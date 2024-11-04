import { Request, Response } from 'express';
import { CredentialType } from '../credentials';
import { requestVC, processCredentialRequest, getUnfulfilledRequest } from '../service/vc.service';

export const vcController = {
    // Request a new VC
    requestVC: async (req: Request, res: Response) => {
        try {
            const type = req.params.type as CredentialType;
            const params = req.body;

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
            
            await processCredentialRequest(type);
            
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
            const request = req.body.request;
            const response = req.body.response;
            
            const unfulfilledRequests = await getUnfulfilledRequest(type, request, response);
            
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
    }
};
