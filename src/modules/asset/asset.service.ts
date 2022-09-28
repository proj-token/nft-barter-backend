import httpStatus from 'http-status';
import config from '../../config/config';
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
// const gnfts: any[] = [];

// async function recurse(url: string, baseUrl: string) {
//   const nfts = await axiosFetchJSON<any>(url);
//   // eslint-disable-next-line no-console
//   console.count('recurse');
//   gnfts.push(...nfts.result);
//   if (nfts.cursor) {
//     // eslint-disable-next-line no-param-reassign
//     url = baseUrl.concat(`&cursor=${nfts.cursor}`);
//     recurse(url, baseUrl);
//   } else {
//     logger.info(gnfts.length);
//     // logger.info(JSON.stringify(gnfts, null, 2));
//     Asset.insertMany(gnfts);
//     return 'Successfuly populated';
//   }
// }

export const populateAssets = async (): Promise<any> => {
  const contracts = config.contracts.addresses;
  const nfts = await fetchAssets(contracts, 'goerli');
  if (nfts.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Nfts Found');
  }
  Asset.insertMany(nfts);
  return 'Successfuly populated';
};

export const fetchAddressNfts = async (address: string, contractAddrs: string[], chain: string) => {
  logger.info(address);

  let url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&format=decimal`;

  const empty = '';
  const contractAddrsUrlString = contractAddrs.reduce((acc, current) => `${acc}&token_addresses=${current}`, empty);

  url = url.concat(contractAddrsUrlString);
  logger.info(url);
  const nfts = await axiosFetchJSON<any>(url);
  logger.info(JSON.stringify(nfts, null, 2));

  return nfts.result;
};

// recurse(
//   'https://deep-index.moralis.io/api/v2/nft/0xF7C6300DC134B8Ab82c6dbdE9d35e54b2E4Bfcfd?chain=goerli&format=decimal',
//   'https://deep-index.moralis.io/api/v2/nft/0xF7C6300DC134B8Ab82c6dbdE9d35e54b2E4Bfcfd?chain=goerli&format=decimal'
// );
