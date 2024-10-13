import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../dto/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private session = new BehaviorSubject<Session | null>(null);
  constructor() {
    this.restoreSession();
  }

  setSession(session: Session) {
    sessionStorage.setItem('session', JSON.stringify(session));
    this.session.next(session);
  }

  getSession() {
    return this.session.asObservable();
  }

  clearSession() {
    sessionStorage.removeItem('session');
    this.session.next(null);
  }

  isLogged() {
    return !!sessionStorage.getItem('session');
  }

  restoreSession() {
    const session = sessionStorage.getItem('session');
    if (session) {
      this.session.next(JSON.parse(session));
    }
  }
}
