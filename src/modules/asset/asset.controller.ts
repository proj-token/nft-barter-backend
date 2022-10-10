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
  if (filter.token_address) {
    filter.token_address = filter.token_address.toUpperCase();
  }
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await assetService.queryAssets(filter, options);
  res.send(result);
});

export const getAssetById = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.query['token_id'] === 'string' && typeof req.params['token_address'] === 'string') {
    const tokenId = req.query['token_id'];
    const tokenAddress = req.params['token_address'].toUpperCase();
    const asset = await assetService.getAssetByTokenId(tokenAddress, tokenId);
    if (!asset) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
    }
    res.send(asset);
  } else {
    res.status(400).send(httpStatus.BAD_REQUEST);
  }
});

export const getAddressNfts = catchAsync(async (req: Request, res: Response) => {
  if (
    typeof req.params['address'] === 'string' &&
    (typeof req.query['cursor'] === 'string' || typeof req.query['cursor'] === 'undefined')
  ) {
    const { address } = req.params;
    const { cursor } = req.query;
    const nfts = await assetService.fetchAddressNfts(address, config.contracts.nftAddresses, config.network, cursor);
    if (!nfts) {
      throw new ApiError(httpStatus.NOT_FOUND, 'nfts not found');
    }
    res.send(nfts);
  } else {
    res.status(400).send(httpStatus.BAD_REQUEST);
  }
});

export const getAddressErc20 = catchAsync(async (req: Request, res: Response) => {
  if (
    typeof req.params['address'] === 'string' &&
    (typeof req.query['cursor'] === 'string' || typeof req.query['cursor'] === 'undefined')
  ) {
    const { address } = req.params;
    const { cursor } = req.query;
    const tokens = await assetService.fetchAddressErc20(address, config.contracts.erc20Addresses, config.network, cursor);
    if (!tokens) {
      throw new ApiError(httpStatus.NOT_FOUND, 'erc20 not found');
    }
    res.send(tokens);
  } else {
    res.status(400).send(httpStatus.BAD_REQUEST);
  }
});

export const getNftOwners = catchAsync(async (req: Request, res: Response) => {
  if (
    typeof req.params['address'] === 'string' &&
    (typeof req.query['cursor'] === 'string' || typeof req.query['cursor'] === 'undefined')
  ) {
    const { address } = req.params;
    const { cursor } = req.query;
    const nftList = await assetService.fetchNftOwners(address, config.network, cursor);
    if (!nftList) {
      throw new ApiError(httpStatus.NOT_FOUND, 'nfts not found');
    }
    res.send(nftList);
  } else {
    res.status(400).send(httpStatus.BAD_REQUEST);
  }
});

export const getNftTokenIdOwner = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['address'] === 'string' && typeof req.params['tokenId'] === 'string') {
    const { address } = req.params;
    const { tokenId } = req.params;
    const nftOwner = await assetService.fetchNftTokenIdOwner(address, config.network, tokenId);
    if (!nftOwner) {
      throw new ApiError(httpStatus.NOT_FOUND, 'nft not found');
    }
    res.send(nftOwner);
  } else {
    res.status(400).send(httpStatus.BAD_REQUEST);
  }
});
