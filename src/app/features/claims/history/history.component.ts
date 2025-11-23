import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuditEvent } from '../../../core/models/claim.model';

@Component({
  selector: 'app-claim-history',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  claimId: string | null = null;
  events: AuditEvent[] = [];
  isPrintMode = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.claimId = this.route.snapshot.paramMap.get('id');
    this.isPrintMode = this.route.snapshot.url.some(s => s.path === 'print');

    if (this.claimId) this.loadHistory(this.claimId);

    if (this.isPrintMode) {
      setTimeout(() => window.print(), 500);
    }
  }

  private loadHistory(id: string): void {
    // TODO: Replace with backend call
    this.events = [
      { at: new Date('2025-11-10T09:20:00Z'), by: 'j.smith', action: 'Created', details: '' },
      { at: new Date('2025-11-11T10:00:00Z'), by: 'j.smith', action: 'Submitted', details: '' },
    ];
  }

  downloadHistory(format: 'pdf' | 'csv') {
    if (!this.claimId) return;
    window.open(`/api/claims/${this.claimId}/history/export?format=${format}`, '_blank');
  }

  printHistory() {
    if (!this.claimId) return;
    window.open(`/dashboard-employee/claims/${this.claimId}/history/print`, '_blank');
  }
}
