import * as jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';

import { ErrorHelper } from './error.utils';

/**
 * Token helper
 */
export class TokenHelper {
  /**
   * Signs token helper
   * @param payload - your json object
   * @param secret - your private hash
   * @param expiresIn - seconds
   * @returns
   */
  static generate(
    payload: Record<string, any>,
    secret: string,
    expiresIn: string,
  ): {
    token: string;
    expires: number;
  } {
    const token = jwt.sign(payload, secret, {
      expiresIn,
    });
    const decoded = jwtDecode(token) as jwt.JwtPayload;
    return {
      token,
      expires: decoded.iat,
    };
  }

  /**
   * Verifys token helper
   * @param token
   * @param secret
   */
  static verify<T>(token: string, secret: string, opts?: jwt.VerifyOptions): T {
    try {
      const options: jwt.VerifyOptions = {
        ...opts,
        algorithms: ['HS256'],
      };
      const payload = jwt.verify(token, secret, options);
      return payload as any;
    } catch (error) {
      if (error.name === 'TokenExpiredError') ErrorHelper.UnauthorizedException('Access token expired');
      if (error.name === 'JsonWebTokenError') ErrorHelper.UnauthorizedException('Access token not valid');
      throw error;
    }
  }
}
