import httpStatus from 'http-status';
import { Request, Response } from 'express';
import config from '../../config/config';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as assetService from './asset.service';

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
    const asset = await assetService.getAssetByTokenId(tokenAddress, tokenId);
    if (!asset) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
    }
    res.send(asset);
  } else {
    res.status(400).send(httpStatus.BAD_REQUEST);
  }
});

export const populateAssets = catchAsync(async (_req: Request, res: Response) => {
  const result = await assetService.populateAssets();
  res.send(result);
});

export const getAddressNfts = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['address'] === 'string') {
    const { address } = req.params;
    const nfts = await assetService.fetchAddressNfts(address, config.contracts.nftAddresses, config.network);
    if (!nfts) {
      throw new ApiError(httpStatus.NOT_FOUND, 'nfts not found');
    }
    res.send(nfts);
  } else {
    res.status(400).send(httpStatus.BAD_REQUEST);
  }
});

export const getAddressErc20 = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['address'] === 'string') {
    const { address } = req.params;
    const tokens = await assetService.fetchAddressErc20(address, config.contracts.erc20Addresses, config.network);
    if (!tokens) {
      throw new ApiError(httpStatus.NOT_FOUND, 'erc20 not found');
    }
    res.send(tokens);
  } else {
    res.status(400).send(httpStatus.BAD_REQUEST);
  }
});
