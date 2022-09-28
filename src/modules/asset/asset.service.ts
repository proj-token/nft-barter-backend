import httpStatus from 'http-status';
import Asset from './asset.model';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IAsset } from './asset.interfaces';
import { axiosFetchJSON } from '../utils/axios';
import { ApiError } from '../errors';
import { logger } from '../logger';

/**
 * Query for assets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryAssets = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const assets = await Asset.paginate(filter, options);
  return assets;
};

/**
 * Get asset by token_id and contract_address
 */
export const getAssetByTokenId = async (token_address: string, token_id: string): Promise<IAsset | null> => {
  logger.info(token_address);
  logger.info(token_id);
  return Asset.findOne({ token_address, token_id }).exec();
};

export async function fetchAssets(contractAddrs: string[], chain: string) {
  const requests = contractAddrs.map(
    (address) => `https://deep-index.moralis.io/api/v2/nft/${address}?chain=${chain}&format=decimal`
  );

  const pending = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const url of requests) {
    const nfts = axiosFetchJSON<any>(url);
    pending.push(nfts);
  }
  const results = await Promise.all(pending);

  const allNfts = results.map((r) => r.result).reduce((acc, val) => acc.concat(val), []);
  return allNfts;
}

export const populateAssets = async (): Promise<any> => {
  const nfts = await fetchAssets(
    ['0x3Bb4B7Bdd1e1C1948f4035E11084b08b5a80E0b2', '0xe14fa5FbA1b55946F2fa78eA3Bd20B952FA5F34E'],
    'goerli'
  );
  if (nfts.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Nfts Found');
  }
  Asset.insertMany(nfts);
  return 'Successfuly populated';
};
