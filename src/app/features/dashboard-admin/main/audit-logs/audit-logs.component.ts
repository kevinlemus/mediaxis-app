import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface AuditLog { time: string; user: string; action: string; entity: string; status: string; }

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css'],
})

export class AuditLogsComponent {
  filter = { user: '', action: '', dateFrom: '', dateTo: '' };
  exporting = false;
  logs: AuditLog[] = [
    { time: '2025-11-26 14:02', user: 'J. Patel', action: 'RESUBMIT', entity: 'Claim #4421', status: 'Queued' },
    { time: '2025-11-26 13:47', user: 'System', action: 'PARSE_UPLOAD', entity: 'Upload batch #991', status: 'Success' },
    { time: '2025-11-26 12:11', user: 'M. Chen', action: 'UPDATE_PAYER', entity: 'Aetna', status: 'Pending' },
    { time: '2025-11-25 18:54', user: 'A. Rivera', action: 'INVITE_USER', entity: 'd.lee@example.com', status: 'Sent' },
    { time: '2025-11-25 16:09', user: 'System', action: 'DAILY_ROLLUP', entity: 'Statistics', status: 'Success' },
  ];

  filteredLogs(): AuditLog[] {
    return this.logs.filter(l => (!this.filter.user || l.user.includes(this.filter.user)) && (!this.filter.action || l.action.includes(this.filter.action)));
  }

  export(type: 'csv' | 'pdf'): void {
    this.exporting = true;
    setTimeout(() => { this.exporting = false; console.log('Export', type); }, 1000);
  }
}
