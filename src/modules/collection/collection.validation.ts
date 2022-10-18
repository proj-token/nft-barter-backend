import Joi from 'joi';

const validateCollections = {
  query: Joi.object().keys({
    address: Joi.string(),
    type: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export default validateCollections;
