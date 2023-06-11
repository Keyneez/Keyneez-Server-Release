import { registerAs } from '@nestjs/config';

export default registerAs('oauth', () => ({
  kakaoClientId: process.env.KAKAO_CLIENT_ID,
  kakaoAdminKey: process.env.KAKAO_ADMIN_KEY,
}));
