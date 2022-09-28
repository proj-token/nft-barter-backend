import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as assetService from './asset.service';
import { logger } from '../logger';
// import { logger } from '../logger';

export const getAssets = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['token_address', 'name']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await assetService.queryAssets(filter, options);
  res.send(result);
});

export const getAssetById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.query['token_id'] === 'string' && typeof req.params['token_address'] === 'string') {
    const tokenId = req.query['token_id'];
    const tokenAddress = req.params['token_address'];
    logger.info(`tokenID ${tokenId}`);
    const asset = await assetService.getAssetByTokenId(tokenAddress, tokenId);
    if (!asset) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
    }
    res.send(asset);
  }
});

export const populateAssets = catchAsync(async (_req: Request, res: Response) => {
  const result = await assetService.populateAssets();
  res.send(result);
});
