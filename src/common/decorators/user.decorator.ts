import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from 'src/interfaces/user.interface';

export const User = createParamDecorator<any, any, IUser>((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return data ? user?.[data] : user;
});

export const ResponseMessage = createParamDecorator<any, any, Response>((data: string, ctx: ExecutionContext) => {
  const response = ctx.switchToHttp().getResponse();
  return data ? response?.[data] : response;
});
