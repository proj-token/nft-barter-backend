import Joi from 'joi';

// eslint-disable-next-line import/prefer-default-export
export const getCollections = {
  query: Joi.object().keys({
    address: Joi.string(),
    type: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
