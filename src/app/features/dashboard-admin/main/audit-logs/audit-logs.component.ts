import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
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
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css'],
})
export class AuditLogsComponent {
  searchTerm = '';
  activeFilter: 'user' | 'action' | 'entity' | 'status' | null = null;

  exporting = false;
  exportSuccess = false;

  logs: AuditLog[] = [
    { time: '2025-11-26 14:02', user: 'J. Patel', action: 'RESUBMIT', entity: 'Claim #4421', status: 'Queued' },
    { time: '2025-11-26 13:47', user: 'System', action: 'PARSE_UPLOAD', entity: 'Upload batch #991', status: 'Success' },
    { time: '2025-11-26 12:11', user: 'M. Chen', action: 'UPDATE_PAYER', entity: 'Aetna', status: 'Pending' },
    { time: '2025-11-25 18:54', user: 'A. Rivera', action: 'INVITE_USER', entity: 'd.lee@example.com', status: 'Sent' },
    { time: '2025-11-25 16:09', user: 'System', action: 'DAILY_ROLLUP', entity: 'Statistics', status: 'Success' },
  ];

  setFilter(type: 'user' | 'action' | 'entity' | 'status') {
    this.activeFilter = type;
  }

  filteredLogs(): AuditLog[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.logs.filter(l => {
      if (!term) return true;

      if (!this.activeFilter) {
        return (
          l.user.toLowerCase().includes(term) ||
          l.action.toLowerCase().includes(term) ||
          l.entity.toLowerCase().includes(term) ||
          l.status.toLowerCase().includes(term)
        );
      }

      return l[this.activeFilter].toLowerCase().includes(term);
    });
  }

  export(type: 'csv' | 'pdf'): void {
    this.exporting = true;
    this.exportSuccess = false;

    setTimeout(() => {
      this.exporting = false;
      this.exportSuccess = true;
      console.log('Export', type);

      setTimeout(() => (this.exportSuccess = false), 4000);
    }, 1000);
  }
}
