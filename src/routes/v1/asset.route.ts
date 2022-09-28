import express, { Router } from 'express';
import { validate } from '../../modules/validate';
// import { auth } from '../../modules/auth';
import { assetController, assetValidation } from '../../modules/asset';

const router: Router = express.Router();

router.route('/').get(validate(assetValidation.getAssets), assetController.getAssets);
router.route('/:token_address').get(validate(assetValidation.getAssetById), assetController.getAssetById); // Pass token id as query param
router.route('/populate').post(validate(assetValidation.getAssets), assetController.populateAssets);

export default router;
