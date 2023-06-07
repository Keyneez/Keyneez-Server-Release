import { IsString } from 'class-validator';

export class RefreshRequestDto {
  @IsString()
  refresh_token: string;
}
