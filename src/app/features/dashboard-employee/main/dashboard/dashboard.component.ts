import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,     // enables routerLink on buttons
    MatIconModule,    // enables <mat-icon>
    MatButtonModule,  // enables mat-raised-button
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  claimsSubmittedThisWeek = 128;
  rejectionsFlagged = 12;

  notifications = [
    { message: 'Claim #1023 was denied', time: '2h ago' },
    { message: 'System update applied successfully', time: 'Yesterday' },
    { message: 'New compliance requirement added', time: '3 days ago' },
  ];

  recentClaims = [
    { id: 1023, status: 'Denied', date: 'Nov 18, 2025' },
    { id: 1024, status: 'Submitted', date: 'Nov 18, 2025' },
    { id: 1025, status: 'Pending', date: 'Nov 17, 2025' },
    { id: 1026, status: 'Approved', date: 'Nov 17, 2025' },
    { id: 1027, status: 'Submitted', date: 'Nov 16, 2025' },
  ];
}
