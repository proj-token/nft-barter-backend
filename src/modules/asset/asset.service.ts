import config from '../../config/config';
import Asset from './asset.model';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IAsset } from './asset.interfaces';
import { axiosFetchJSON } from '../utils/axios';
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
  return Asset.findOne({ token_address, token_id }).exec();
};

async function fetchRecursive(url: string, baseUrl: string, accumulator: any[]) {
  const nfts = await axiosFetchJSON<any>(url);
  accumulator.push(...nfts.result);
  if (nfts.cursor) {
    // eslint-disable-next-line no-param-reassign
    url = baseUrl.concat(`&cursor=${nfts.cursor}`);
    fetchRecursive(url, baseUrl, accumulator);
  } else {
    Asset.insertMany(accumulator);
  }

  return 1;
}

export const populateAssets = async (): Promise<any> => {
  const count = await Asset.estimatedDocumentCount();
  if (count > 0) return; // Already populated
  const contracts = config.contracts.nftAddresses;
  const requests = contracts.map(
    (address) => `https://deep-index.moralis.io/api/v2/nft/${address}?chain=${config.network}&format=decimal`
  );
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const url of requests) {
      // eslint-disable-next-line no-await-in-loop
      await fetchRecursive(url, url, []);
    }
  } catch (error) {
    logger.error(error);
    throw new Error('Assets population Failed ');
  }
};

export const fetchAddressNfts = async (address: string, contractAddrs: string[], chain: string) => {
  let url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&format=decimal`;
  const empty = '';
  const contractAddrsUrlString = contractAddrs.reduce((acc, current) => `${acc}&token_addresses=${current}`, empty);
  url = url.concat(contractAddrsUrlString);
  const nfts = await axiosFetchJSON<any>(url);

  return nfts.result;
};

export const fetchAddressErc20 = async (address: string, contractAddrs: string[], chain: string) => {
  let url = `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=${chain}&format=decimal`;
  const empty = '';
  const contractAddrsUrlString = contractAddrs.reduce((acc, current) => `${acc}&token_addresses=${current}`, empty);
  url = url.concat(contractAddrsUrlString);
  const tokens = await axiosFetchJSON<any>(url);
  return tokens;
};

export const fetchNftOwners = async (contractAddress: string, chain: string, cursor?: string) => {
  let url = `https://deep-index.moralis.io/api/v2/nft/${contractAddress}/owners?chain=${chain}&format=decimal`;
  if (cursor) url = `${url}&cursor=${cursor}`;
  const nftList = await axiosFetchJSON<any>(url);
  return nftList;
};
