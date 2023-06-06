import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpired: process.env.ACCESS_TOKEN_EXPIRED,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpired: process.env.REFRESH_TOKEN_EXPIRED,
}));
