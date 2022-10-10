import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { ICollection, ICollectionModel } from './collection.interfaces';

const collectionSchema = new mongoose.Schema<ICollection, ICollectionModel>(
  {
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      uppercase: true,
    },
    imgUrl: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
collectionSchema.plugin(toJSON);
collectionSchema.plugin(paginate as any);

const Collection = mongoose.model<ICollection, ICollectionModel>('Collection', collectionSchema);

export default Collection;
