export class OAuthUserTypeDto {
  snsType: string;
  snsId: string;

  constructor(snsType: string, snsId: string) {
    this.snsId = snsId;
    this.snsType = snsType;
  }
}
