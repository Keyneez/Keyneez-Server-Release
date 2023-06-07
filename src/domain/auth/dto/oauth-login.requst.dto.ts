import { IsString } from 'class-validator';

export class OAuthLoginRequestDto {
  @IsString()
  id_token: string;
}
