import { Model } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ICollection {
  title: string | null;
  address: string;
  type: string;
  imgUrl: string | null;
}

export interface ICollectionModel extends Model<ICollection> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}
