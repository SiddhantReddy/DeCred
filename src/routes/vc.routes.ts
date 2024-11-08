import express from 'express';
import { vcController } from '../controllers/vc.controller';

const router = express.Router();

// VC Request routes
router.post('/request/:type', vcController.requestVC);
router.post('/process/:type', vcController.processCredentialRequest);
router.post('/process/:type/:id', vcController.processCredentialRequestById);
router.get('/unfulfilled/:type', vcController.getUnfulfilledRequests);
router.get('/search/:type', vcController.serachCredential);

export default router;