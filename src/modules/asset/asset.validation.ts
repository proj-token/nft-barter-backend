import Joi from 'joi';

export const getAssets = {
  query: Joi.object().keys({
    token_address: Joi.string(),
    name: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getAssetById = {
  params: Joi.object().keys({
    token_address: Joi.string().required(),
  }),
  query: Joi.object().keys({
    token_id: Joi.string().required(),
  }),
};

export const getOwnerTokens = {
  params: Joi.object().keys({
    address: Joi.string().required(),
  }),
};

export const getNftOwner = {
  params: Joi.object().keys({
    address: Joi.string().required(),
  }),
  query: Joi.object().keys({
    cursor: Joi.string(),
  }),
};

export const getNftTokenIdOwner = {
  params: Joi.object().keys({
    address: Joi.string().required(),
    tokenId: Joi.string().required(),
  }),
};
