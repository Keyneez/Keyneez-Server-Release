export class OAuthUserTypeDto {
  snsType: string;
  snsId: string;
  email: string;
  constructor(snsType: string, snsId: string, email: string) {
    this.snsId = snsId;
    this.snsType = snsType;
    this.email = email;
  }
}
