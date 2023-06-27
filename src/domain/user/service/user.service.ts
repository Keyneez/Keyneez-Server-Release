import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { UserInfoResponseDto } from '../dtos/user-info.response.dto';

@Injectable()
export class UserService {
  constructor(private userRepsotiry: UserRepository) {}

  async getUserInfo(userPk: number): Promise<UserInfoResponseDto> {
    const user = await this.userRepsotiry.findByPk(userPk);
    return new UserInfoResponseDto(user);
  }
}
