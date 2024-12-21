import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  async getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    return {
        // @ts-ignore
      session: request.session,
      state: request.query.state,
      response,
    };
  }
}
