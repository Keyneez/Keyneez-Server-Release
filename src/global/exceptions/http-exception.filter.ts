import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../dtos/response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    let responseBody = null;
    if (typeof error === 'string') {
      responseBody = ResponseDto.fail(status, error);
    } else {
      const message: string =
        typeof error.message === 'string' ? error.message : error.message[0];
      responseBody = ResponseDto.fail(status, message);
    }
    response.status(status).send(responseBody);
  }
}
