import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../../../core/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatRippleModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Output() openProfile = new EventEmitter<void>();
  user$: Observable<User>;

  constructor(private userService: UserService) {
    this.user$ = this.userService.user$;
  }

    logout() {
    // Placeholder for now
    console.log('Logout clicked');
    // Later: this.userService.logout();
  }
}
