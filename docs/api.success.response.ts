import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../src/global/dtos/response.dto';

export interface ApiSuccessCreateOptions {
  isArray: boolean;
  status?: number;
  exampleDesciption?: string;
  model: Type<any>;
  isNotValue?: boolean;
}

export function ApiSuccessResponse(options: ApiSuccessCreateOptions) {
  const { isArray, status, exampleDesciption, model, isNotValue } = options;
  const modelType = isArray ? 'array' : 'object';
  let dataPropertySwaggerValue: any = {
    type: 'array',
    example: '[]',
  };

  if (!isNotValue) {
    dataPropertySwaggerValue = isArray
      ? {
          type: modelType,
          items: { $ref: getSchemaPath(model) },
        }
      : {
          type: modelType,
          $ref: getSchemaPath(model),
        };
  }

  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(ResponseDto),
          },
          {
            properties: {
              status: {
                type: 'number',
                example: status ? status : 200,
                description: 'HTTP STATUS 코드',
              },
              message: {
                type: 'string',
                example: exampleDesciption ? exampleDesciption : 'xx 조회 성공',
                description: 'API 결과값에 대한 메시지',
              },
              data: dataPropertySwaggerValue,
            },
          },
        ],
      },
    }),
  );
}
