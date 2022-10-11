import { Model, Document } from 'mongoose';
import { Token } from '../asset/asset.interfaces';
import { QueryResult } from '../paginate/paginate';

export type UpdateOrder = {
  taker: string;
  status: Status;
};

export type NewCreateOrder = Omit<IOrder, 'taker' | 'status'>;

export enum Status {
  Active = 'Active',
  Filled = 'Filled',
}

export enum OrderType {
  BasicNft = 'BasicNft',
  BasicFt = 'BasicFt',
  Mixed = 'Mixed',
}

export interface IOrder {
  orderId: number;
  order: ISubOrder;
  sig: Sig;
  call: Call;
  counterOrder: ISubOrder;
  counterSig: Sig;
  counterCall: Call;
  metadata: string;
  taker: string;
  status: Status;
  type: OrderType;
  tokens: {
    maker: Token[];
    taker: Token[];
  };
}
export interface ISubOrder {
  registry: string;
  maker: string;
  staticTarget: string;
  staticSelector: string;
  staticExtradata: string;
  maximumFill: string;
  listingTime: string;
  expirationTime: string;
  salt: string;
}

export interface Call {
  target: string;
  howToCall: 0 | 1;
  data: string;
}

export interface Sig {
  v: number;
  r: string;
  s: string;
}

export interface IOrderModel extends Model<IOrder> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export interface IOrderDoc extends IOrder, Document {}
