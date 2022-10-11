import { Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IAsset {
  token_hash: string;
  token_address: string;
  token_id: string;
  block_number_minted: string;
  amount: string;
  contract_type: string;
  name: string;
  symbol: string;
  token_uri: string | null;
  metadata: string | null;
  last_token_uri_sync: string | null;
  last_metadata_sync: string | null;
}

export interface IAssetModel extends Model<IAsset> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export interface Token {
  // The asset's token ID, or null if ERC-20
  token_id: string | null;
  // The asset's contract address
  token_address: string;
  type: 'ERC721' | 'ERC20';
  // Optional for fungible items
  decimals?: number;
  // Always 1 for erc721
  amount: string;
}
