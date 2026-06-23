import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const payload = request['user'];

    if(!payload){
      throw new UnauthorizedException();//si no hay payload es que no hubo autenticación
    }

    if (payload.perfil === 'administrador'){
      return true;
    } else{
      throw new ForbiddenException();
    }
  }
}
