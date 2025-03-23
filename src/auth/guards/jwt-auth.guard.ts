import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
      // Add your custom pre-activation logic here, if needed
      return super.canActivate(context);
    }
  
    handleRequest(err, user, info) {
      if (err || !user) {
        throw err || new UnauthorizedException();
      }
      return user; // `user` will be available as `request.user`
    }
  }
  