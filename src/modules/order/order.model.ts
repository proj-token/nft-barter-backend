import mongoose from 'mongoose';
import Inc from 'mongoose-sequence';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { Call, IOrder, IOrderModel, ISubOrder, OrderType, Sig, Status } from './order.interfaces';
import { Token } from '../asset/asset.interfaces';

const subOrderSchema = new mongoose.Schema<ISubOrder>({
  registry: { type: String, required: true, trim: true },
  maker: { type: String, required: true, trim: true },
  staticTarget: { type: String, required: true, trim: true },
  staticSelector: { type: String, required: true, trim: true },
  staticExtradata: { type: String, required: true, trim: true },
  maximumFill: { type: String, required: true, trim: true },
  listingTime: { type: String, required: true, trim: true },
  expirationTime: { type: String, required: true, trim: true },
  salt: { type: String, required: true, trim: true },
});

const callSchema = new mongoose.Schema<Call>({
  target: { type: String, required: true, trim: true },
  howToCall: { type: Number, required: true, enum: [0, 1] },
  data: { type: String, required: true, trim: true },
});

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
const sigSchema = new mongoose.Schema<Sig>({
  v: { type: Number, required: true, default: 27 },
  r: { type: String, required: true, trim: true, default: ZERO_BYTES32 },
  s: { type: String, required: true, trim: true, default: ZERO_ADDRESS },
});

const tokenSchema = new mongoose.Schema<Token>({
  token_address: { type: String, required: true, trim: true },
  token_id: { type: String, required: false, trim: true, default: null },
  type: { type: String, required: true, enum: ['ERC721', 'ERC20'], default: 'ERC721' },
  decimals: { type: String, required: false, default: '18' },
  amount: { type: String, required: false, trim: true, default: '1' },
});
const orderSchema = new mongoose.Schema<IOrder, IOrderModel>(
  {
    order: { type: subOrderSchema, required: true },
    sig: { type: sigSchema, required: true },
    call: { type: callSchema, required: true },
    counterOrder: { type: subOrderSchema, required: true },
    counterSig: { type: sigSchema, required: true },
    counterCall: { type: callSchema, required: true },
    metadata: { type: String, required: true, trim: true },
    taker: { type: String, required: true, trim: true, default: '0x' },
    status: { type: String, required: true, enum: Status, default: Status.Active },
    type: { type: String, required: true, enum: OrderType, default: OrderType.BasicNft },
    tokens: { taker: [tokenSchema], maker: [tokenSchema] },
  },
  {
    timestamps: true,
  }
);

// The @types/mongoose-sequence package is incorrect, so we ignore the error here. Follow docs here:
// https://github.com/ramiel/mongoose-sequence
// https://stackoverflow.com/a/71859686
// https://github.com/ramiel/mongoose-sequence/issues/111
// @ts-expect-error
const AutoIncrement = Inc(mongoose);
// @ts-expect-error
orderSchema.plugin(AutoIncrement, { inc_field: 'orderId' });

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate as any);

const Order = mongoose.model<IOrder, IOrderModel>('Order', orderSchema);

export default Order;
