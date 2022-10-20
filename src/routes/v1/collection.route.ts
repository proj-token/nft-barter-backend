import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { getCollections, collectionValidation } from '../../modules/collection';

const router: Router = express.Router();

router.route('/').get(validate(collectionValidation), getCollections);

export default router;
