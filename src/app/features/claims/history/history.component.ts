// features/claims/history/history.component.ts
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
    if (this.isPrintMode) setTimeout(() => window.print(), 500);
  }

  private loadHistory(id: string): void {
    // TODO: Replace with backend call. Sample events include diffs and roles.
    this.events = [
      {
        at: new Date('2025-11-10T09:20:00Z'),
        by: 'j.smith',
        role: 'Billing Specialist',
        action: 'Created',
        details: 'Initial claim created from encounter ENC-001',
        hash: 'hash-1',
      },
      {
        at: new Date('2025-11-11T10:00:00Z'),
        by: 'j.smith',
        role: 'Billing Specialist',
        action: 'Submitted',
        details: 'Claim submitted to payer BlueCross (ID: BC123)',
        hash: 'hash-2',
        prevHash: 'hash-1',
      },
      {
        at: new Date('2025-11-12T09:30:00Z'),
        by: 'j.smith',
        role: 'Billing Specialist',
        action: 'Edited',
        details: 'Corrected policy number prior to resubmission',
        diff: {
          'insurance.policyNumber': { before: 'POL-12X', after: 'POL-123' },
        },
        hash: 'hash-3',
        prevHash: 'hash-2',
      },
    ];
  }

  downloadHistory(format: 'pdf' | 'csv'): void {
    if (!this.claimId) return;
    window.open(`/api/claims/${this.claimId}/history/export?format=${format}`, '_blank');
  }

  printHistory(): void {
    if (!this.claimId) return;
    window.open(`/dashboard-employee/claims/${this.claimId}/history/print`, '_blank');
  }
}
