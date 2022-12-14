import * as seedData from './seed';
import Collection from './collection.model';
import { IOptions, QueryResult } from '../paginate/paginate';
/**
 * Query for assets
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryCollections = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const collections = await Collection.paginate(filter, options);
  return collections;
};

export const populateAssetCollections = async (): Promise<any> => {
  const count = await Collection.estimatedDocumentCount();
  if (count > 0) return; // Already populated
  Collection.insertMany(seedData.collections);
};
