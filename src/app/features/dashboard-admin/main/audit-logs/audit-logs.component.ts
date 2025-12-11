import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface AuditLog {
  time: string;
  user: string;
  action: string;
  entity: string;
  status: string;
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css'],
})
export class AuditLogsComponent {
  filter = { user: '', action: '', dateFrom: '', dateTo: '' };
  exporting = false;
  exportSuccess = false;

  logs: AuditLog[] = [
    { time: '2025-11-26 14:02', user: 'J. Patel', action: 'RESUBMIT', entity: 'Claim #4421', status: 'Queued' },
    { time: '2025-11-26 13:47', user: 'System', action: 'PARSE_UPLOAD', entity: 'Upload batch #991', status: 'Success' },
    { time: '2025-11-26 12:11', user: 'M. Chen', action: 'UPDATE_PAYER', entity: 'Aetna', status: 'Pending' },
    { time: '2025-11-25 18:54', user: 'A. Rivera', action: 'INVITE_USER', entity: 'd.lee@example.com', status: 'Sent' },
    { time: '2025-11-25 16:09', user: 'System', action: 'DAILY_ROLLUP', entity: 'Statistics', status: 'Success' },
  ];

  filteredLogs(): AuditLog[] {
    const termUser = this.filter.user.trim().toLowerCase();
    const termAction = this.filter.action.trim().toLowerCase();

    return this.logs.filter(l =>
      (!termUser || l.user.toLowerCase().includes(termUser)) &&
      (!termAction || l.action.toLowerCase().includes(termAction))
    );
  }

  export(type: 'csv' | 'pdf'): void {
    this.exporting = true;
    this.exportSuccess = false;

    setTimeout(() => {
      this.exporting = false;
      this.exportSuccess = true;
      console.log('Export', type);

      // Auto-hide success banner after 4 seconds
      setTimeout(() => (this.exportSuccess = false), 4000);
    }, 1000);
  }
}
