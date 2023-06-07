export class RefreshResponseDto {
  readonly accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}
