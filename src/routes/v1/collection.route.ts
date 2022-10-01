import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { collectionController, collectionValidation } from '../../modules/collection';

const router: Router = express.Router();

router.route('/').get(validate(collectionValidation.getCollections), collectionController.getCollections);

export default router;
