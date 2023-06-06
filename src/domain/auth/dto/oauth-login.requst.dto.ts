import { IsString } from 'class-validator';

export class OAuthLoginRequestDto {
  @IsString()
  idToken: string;
}
