import { Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IAsset {
  token_hash: string | null;
  token_address: string | null;
  token_id: string | null;
  block_number_minted: string | null;
  amount: string | null;
  contract_type: string | null;
  name: string | null;
  symbol: string | null;
  token_uri: string | null;
  metadata: string | null;
  last_token_uri_sync: string | null;
  last_metadata_sync: string | null;
}

export interface IAssetModel extends Model<IAsset> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
