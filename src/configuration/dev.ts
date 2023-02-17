import * as dotenv from 'dotenv';

dotenv.config();
export default () => ({
  app: {
    baseUrlPrefix: process.env.NODE_ENV === 'dev' ? process.env.APP_URL + '/api' : '/api',
    docsBaseUrl: '/docs',
  },
  accessToken: {
    expiresIn: '8h',
    secret: 'superSecretKey',
  },
  refreshToken: {
    expiresIn: '1d',
  },
});
