import { Component } from '@angular/core';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = false;
  constructor(private sessionService: SessionService) { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.sessionService.clearSession();
    window.location.href = '/';
  }
}
