import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { assetController, assetValidation } from '../../modules/asset';

const router: Router = express.Router();

router.route('/').get(validate(assetValidation.getAssets), assetController.getAssets);
router.route('/:token_address').get(validate(assetValidation.getAssetById), assetController.getAssetById); // Pass token id as query param
router.route('/nft/:address').get(validate(assetValidation.getOwnerTokens), assetController.getAddressNfts);
router.route('/erc20/:address').get(validate(assetValidation.getOwnerTokens), assetController.getAddressErc20);
router.route('/owners/:address').get(validate(assetValidation.getNftOwner), assetController.getNftOwners);
router
  .route('/owners/:address/:tokenId')
  .get(validate(assetValidation.getNftTokenIdOwner), assetController.getNftTokenIdOwner);

export default router;
