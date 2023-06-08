export class OidcPublicKeyDto {
  //	공개키 ID
  kid: string;
  //공개키 타입, RSA로 고정
  kty: string;
  //암호화 알고리즘
  alg: string;
  //공개키의 용도, sig(서명)으로 고정
  use: string;
  //공개키 모듈(Modulus)
  //공개키는 n과 e의 쌍으로 구성됨
  n: string;
  //	공개키 지수(Exponent)
  e: string;
}
