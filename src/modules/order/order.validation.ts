import Joi from 'joi';
import { NewCreateOrder, OrderType, Status } from './order.interfaces';

const orderSchema = Joi.object().keys({
  registry: Joi.string().alphanum().min(42).max(42).required(),
  maker: Joi.string().alphanum().required(),
  staticTarget: Joi.string().alphanum().min(42).max(42).required(),
  staticSelector: Joi.string().required(),
  staticExtradata: Joi.string().required(),
  maximumFill: Joi.number().integer().required(),
  listingTime: Joi.number().integer().required(),
  expirationTime: Joi.number().integer().required(),
  salt: Joi.number().integer().required(),
});

const callSchema = Joi.object().keys({
  target: Joi.string().alphanum().min(42).max(42).required(),
  howToCall: Joi.number().integer().valid(0, 1).required(),
  data: Joi.string().required(),
});

const sigSchema = Joi.object().keys({
  v: Joi.number().integer().required(),
  r: Joi.string().required(),
  s: Joi.string().required(),
});

const tokenSchema = Joi.object().keys({
  token_address: Joi.string().alphanum().min(42).max(42).required(),
  token_id: Joi.number().integer(),
  type: Joi.string().valid('ERC721', 'ERC20').required(),
  decimals: Joi.number().integer(),
  amount: Joi.number().integer(),
});

const createOrderBody: Record<keyof NewCreateOrder, any> = {
  orderId: Joi.number().forbidden(),
  order: orderSchema.required(),
  sig: sigSchema.required(),
  call: callSchema.required(),
  counterOrder: orderSchema.required(),
  counterSig: sigSchema,
  counterCall: callSchema,
  metadata: Joi.string().required(),
  type: Joi.string().valid(OrderType.Basic, OrderType.Mixed).required(),
  tokens: Joi.object().keys({
    maker: Joi.array().items(tokenSchema).min(1).required(),
    taker: Joi.array().items(tokenSchema).min(1).required(),
  }),
};

export const createOrder = {
  body: Joi.object().keys(createOrderBody),
};

export const getOrders = {
  query: Joi.object().keys({
    status: Joi.string().valid(Status.Active, Status.Filled),
    taker: Joi.string().alphanum().min(42).max(42),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getOrder = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};

export const updateOrder = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object()
    .keys({
      taker: Joi.string().alphanum().min(42).max(42).required(),
      status: Joi.string().valid(Status.Filled).required(),
    })
    .min(2),
};

export const deleteOrder = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
};
