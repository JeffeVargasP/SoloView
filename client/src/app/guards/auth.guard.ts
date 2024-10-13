import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../service/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = new SessionService();

  if (!sessionService.isLogged()) {
    new Router().navigate(['']);
    return false;
  }

  return true;
};
