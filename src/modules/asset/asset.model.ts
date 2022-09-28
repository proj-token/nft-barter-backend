import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IAsset, IAssetModel } from './asset.interfaces';

const assetSchema = new mongoose.Schema<IAsset, IAssetModel>(
  {
    token_hash: {
      type: String,
      required: true,
      trim: true,
    },
    token_address: {
      type: String,
      required: true,
    },
    token_id: {
      type: String,
      required: true,
    },
    block_number_minted: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    contract_type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    token_uri: {
      type: String,
      required: true,
    },
    metadata: {
      type: String,
      required: false,
    },
    last_token_uri_sync: {
      type: String,
      required: true,
    },
    last_metadata_sync: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
assetSchema.plugin(toJSON);
assetSchema.plugin(paginate);

const Asset = mongoose.model<IAsset, IAssetModel>('Asset', assetSchema);

export default Asset;
