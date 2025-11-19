import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  // Demo metrics (replace with service data later)
  claimsSubmittedThisWeek = 128;
  rejectionsFlagged = 12;

  // Notifications feed
  notifications = [
    { message: 'Claim #1023 was denied', time: '2h ago' },
    { message: 'System update applied successfully', time: 'Yesterday' },
    { message: 'New compliance requirement added', time: '3 days ago' },
  ];

  // Recent claims list (MVP placeholder data)
  recentClaims = [
    { id: 1023, status: 'Denied', date: 'Nov 18, 2025' },
    { id: 1024, status: 'Submitted', date: 'Nov 18, 2025' },
    { id: 1025, status: 'Pending', date: 'Nov 17, 2025' },
    { id: 1026, status: 'Approved', date: 'Nov 17, 2025' },
    { id: 1027, status: 'Submitted', date: 'Nov 16, 2025' },
  ];
}
