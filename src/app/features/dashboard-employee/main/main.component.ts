import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ProfileDrawerComponent } from '../profile-drawer/profile-drawer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    SidebarComponent,
    ProfileDrawerComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class EmployeeMainComponent {
  @ViewChild('profileSidenav') profileSidenav!: MatSidenav;

  openProfileDrawer() {
    this.profileSidenav.open();
  }

  closeProfileDrawer() {
    this.profileSidenav.close();
  }
}