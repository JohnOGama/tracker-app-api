import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
  
  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
  {
    intercept(
      context: ExecutionContext,
      next: CallHandler<T>,
    ): Observable<ApiResponse<T>> {
      return next.handle().pipe(
        map((data) => {
          const isObject = data !== null && typeof data === 'object';
          const customMessage =
            isObject && 'custom_message' in data
              ? (data as any).custom_message
              : null;
  
          return {
            status_code: context.switchToHttp().getResponse().statusCode,
            message: customMessage || 'Success',
            data: isObject && 'data' in data ? (data as any).data : data,
          };
        }),
      );
    }
  }
  