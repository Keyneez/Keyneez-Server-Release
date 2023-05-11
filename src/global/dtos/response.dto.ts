import { HttpStatus } from '@nestjs/common';
import { Exclude } from 'class-transformer';

export class ResponseDto<T> {
  private status: number;
  private message: string;
  @Exclude() private data: T;

  constructor(status: number, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static ok(status: HttpStatus, message: string): ResponseDto<[]> {
    return new ResponseDto(status, message, []);
  }

  static okWithData<T>(
    status: HttpStatus,
    message: string,
    data: T,
  ): ResponseDto<T> {
    return new ResponseDto(status, message, data);
  }

  static fail(status: HttpStatus, message: string) {
    return new ResponseDto(status, message);
  }
}
