import { Component } from '@angular/core';
import { SessionService } from '../service/session.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isMenuOpen = false;
  isSidebarVisible = false;

  constructor(private sessionService: SessionService) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  logout() {
    this.sessionService.clearSession();
    window.location.href = '/';
  }
}
