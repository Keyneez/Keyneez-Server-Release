export class RefreshResponseDto {
  readonly access_token: string;

  constructor(token: string) {
    this.access_token = token;
  }
}
