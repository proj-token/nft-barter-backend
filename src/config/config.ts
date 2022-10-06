import Joi from 'joi';
import 'dotenv/config';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    X_API_Key: Joi.string().required().description('Moralis-Api-Key'),
    NETWORK: Joi.string().required().description('Chain or network'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  network: envVars.NETWORK,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    cookieOptions: {
      httpOnly: true,
      secure: envVars.NODE_ENV === 'production',
      signed: true,
    },
  },
  moralis: {
    key: envVars.X_API_Key,
  },
  contracts: {
    nftAddresses: [
      '0xA852c97ea3a2d974eCe086e7024EE281F246a959',
      '0x3Bb4B7Bdd1e1C1948f4035E11084b08b5a80E0b2',
      '0xe14fa5FbA1b55946F2fa78eA3Bd20B952FA5F34E',
      '0xF7C6300DC134B8Ab82c6dbdE9d35e54b2E4Bfcfd',
      // '0x6e4c6D9B0930073e958ABd2ABa516b885260b8Ff',
    ],
    erc20Addresses: [
      '0x7641d1CBE8aD00b90dc8C4cB48300Dfbd48b548E',
      '0x7de36Cb215126ceabF87f39e90d03A8287dc8Ca0',
      '0xBcAEE3B661663F04036af861237e534c818496d2',
      '0x85B2aeC8F0196AaeD22a03F4cEa9F3719A73f0fD',
    ],
  },
};
export default config;
