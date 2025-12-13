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
  sortField: 'time' | 'user' | 'action' | 'entity' | 'status' = 'time';
  sortDirection: 'asc' | 'desc' | 'successFirst' | 'pendingFirst' | 'queuedFirst' | 'sentFirst' = 'desc';

  exporting = false;
  exportSuccess = false;

  logs: AuditLog[] = [
    { time: '2025-11-26 14:02', user: 'J. Patel', action: 'RESUBMIT', entity: 'Claim #4421', status: 'Queued' },
    { time: '2025-11-26 13:47', user: 'System', action: 'PARSE_UPLOAD', entity: 'Upload batch #991', status: 'Success' },
    { time: '2025-11-26 12:11', user: 'M. Chen', action: 'UPDATE_PAYER', entity: 'Aetna', status: 'Pending' },
    { time: '2025-11-25 18:54', user: 'A. Rivera', action: 'INVITE_USER', entity: 'd.lee@example.com', status: 'Sent' },
    { time: '2025-11-25 16:09', user: 'System', action: 'DAILY_ROLLUP', entity: 'Statistics', status: 'Success' },
  ];

  private statusOrder: Record<string, number> = {
    queued: 1,
    pending: 2,
    sent: 3,
    success: 4,
  };

  setFilter(type: 'user' | 'action' | 'entity' | 'status') {
    this.activeFilter = this.activeFilter === type ? null : type;
  }

  filteredLogs(): AuditLog[] {
    const term = this.searchTerm.trim().toLowerCase();

    const filtered = this.logs.filter(l => {
      if (!term) return true;

      const haystack = `${l.time} ${l.user} ${l.action} ${l.entity} ${l.status}`.toLowerCase();
      return haystack.includes(term);
    });

    return this.sortLogs(filtered);
  }

  private sortLogs(list: AuditLog[]): AuditLog[] {
    const field = this.sortField;
    const direction = this.sortDirection;

    const parseTime = (t: string) => new Date(t.replace(' ', 'T'));

    const comparator = (a: AuditLog, b: AuditLog) => {
      let valA: any = a[field as keyof AuditLog];
      let valB: any = b[field as keyof AuditLog];

      if (field === 'time') {
        valA = parseTime(valA as string).getTime();
        valB = parseTime(valB as string).getTime();
      }

      if (field === 'status') {
        const rank = (s: string) => this.statusOrder[s?.toLowerCase()] ?? 99;
        const prefer = (target: string) => (value: string) => (value?.toLowerCase() === target ? 0 : 1);

        const priorityComparator = (target: string) => {
          const pA = prefer(target)(valA as string);
          const pB = prefer(target)(valB as string);
          if (pA !== pB) return pA - pB;
          return rank(valA as string) - rank(valB as string);
        };

        switch (direction) {
          case 'successFirst':
            return priorityComparator('success');
          case 'pendingFirst':
            return priorityComparator('pending');
          case 'queuedFirst':
            return priorityComparator('queued');
          case 'sentFirst':
            return priorityComparator('sent');
          case 'asc':
            return rank(valA as string) - rank(valB as string);
          case 'desc':
          default:
            return rank(valB as string) - rank(valA as string);
        }
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return parseTime(b.time).getTime() - parseTime(a.time).getTime();
    };

    return [...list].sort(comparator);
  }

  setSort(field: 'time' | 'user' | 'action' | 'entity' | 'status') {
    if (this.sortField === field) {
      if (field === 'status') {
        const cycle: Array<typeof this.sortDirection> = ['successFirst', 'pendingFirst', 'queuedFirst', 'sentFirst'];
        const idx = cycle.indexOf(this.sortDirection);
        this.sortDirection = cycle[(idx + 1) % cycle.length];
      } else {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      }
    } else {
      this.sortField = field;
      if (field === 'status') {
        this.sortDirection = 'successFirst';
      } else {
        this.sortDirection = field === 'time' ? 'desc' : 'asc';
      }
    }
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
