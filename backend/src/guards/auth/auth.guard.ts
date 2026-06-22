import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {//me permite acceder a los argumentos o metadatos de una petición
    const request = context.switchToHttp().getRequest();//accedo a los argumentos de la petición (en este caso me interesa la cookie)
    const token = this.extractTokenFromCookie(request); //saco el token guardado la cookie que viene con la petición
    if (!token) {
      throw new UnauthorizedException();//sin token no hay autorización
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    if(request.cookies && request.cookies['access_token']) {
      return request.cookies['access_token'];
    }
    
    return undefined;
  }
}
