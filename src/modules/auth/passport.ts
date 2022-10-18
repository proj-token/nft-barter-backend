import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config/config';
import { logger } from '../logger';

export interface IPayload extends JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: string;
}

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
    try {
      logger.info(JSON.stringify(payload.type, null, 2));
      if (payload.type !== 'JWT') {
        throw new Error('Invalid token type');
      }
      done(null, true);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
