import { Router } from 'express';
import { schemaController } from '../controllers/schema.controller';

const router = Router();


router.get('/org', schemaController.getOrganisationTypes);
router.get('/:type', schemaController.getCredentialSchema);
router.post('/:type/validate', schemaController.validateCredentialParams);

export default router;