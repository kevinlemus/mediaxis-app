// features/claims/history/history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuditEvent } from '../../../core/models/claim.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    this.isPrintMode = this.route.snapshot.url.some((s) => s.path === 'print');
    if (this.claimId) this.loadHistory(this.claimId);
    if (this.isPrintMode) setTimeout(() => this.printHistory(), 300);
  }

  private loadHistory(id: string): void {
    // Demo events – replace with backend fetch
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
      {
        at: new Date('2025-11-12T11:15:00Z'),
        by: 'm.lee',
        role: 'Front Desk',
        action: 'Edited',
        details: 'Updated patient contact details',
        diff: {
          'patient.phone': {
            before: '(317) 555-0000',
            after: '(317) 555-0123',
          },
          'patient.email': {
            before: 'john@oldmail.com',
            after: 'john.doe@example.com',
          },
        },
        hash: 'hash-4',
        prevHash: 'hash-3',
      },
      {
        at: new Date('2025-11-12T15:20:00Z'),
        by: 'r.patel',
        role: 'Billing Supervisor',
        action: 'Edited',
        details: 'Provider credentials alignment',
        diff: {
          'provider.billingNPI': { before: '0000000000', after: '0987654321' },
          'provider.taxonomyCode': {
            before: '207N00000X',
            after: '207Q00000X',
          },
          'provider.specialtyCode': { before: '02', after: '01' },
        },
        hash: 'hash-5',
        prevHash: 'hash-4',
      },
      {
        at: new Date('2025-11-13T08:00:00Z'),
        by: 'j.smith',
        role: 'Billing Specialist',
        action: 'StatusChanged',
        details: 'Status changed In Review -> Submitted',
        hash: 'hash-6',
        prevHash: 'hash-5',
      },
    ];
  }

  downloadHistory(format: 'pdf' | 'csv'): void {
    if (!this.claimId) return;
    if (format === 'csv') this.downloadCsv();
    else this.downloadPdf();
  }

  printHistory(): void {
    if (!this.claimId) return;
    const pdf = this.buildPdf();
    pdf.autoPrint();
    const blobUrl = pdf.output('bloburl');
    window.open(blobUrl, '_blank');
  }

  // ----- CSV export -----
  private downloadCsv(): void {
    const escape = (v: any) => {
      const s = v == null ? '' : String(v).replace(/\r?\n+/g, ' ');
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines: string[] = [];
    const pushHeader = (t: string) => lines.push(`# ${t}`);

    pushHeader(`History for Claim ${this.claimId}`);
    lines.push(
      ['At', 'By', 'Role', 'Action', 'Details', 'DiffCount', 'Hash', 'PrevHash']
        .map(escape)
        .join(',')
    );
    this.events.forEach((ev) => {
      const diffCount = ev.diff ? Object.keys(ev.diff).length : 0;
      lines.push(
        [
          ev.at.toISOString(),
          ev.by,
          ev.role || '',
          ev.action,
          ev.details || '',
          String(diffCount),
          ev.hash || '',
          ev.prevHash || '',
        ]
          .map(escape)
          .join(',')
      );
    });

    if (this.events.some((e) => e.diff)) {
      lines.push('');
      pushHeader('Field Diffs');
      lines.push(['At', 'Field', 'Before', 'After'].map(escape).join(','));
      this.events.forEach((ev) => {
        if (!ev.diff) return;
        Object.entries(ev.diff).forEach(([path, val]) => {
          lines.push(
            [ev.at.toISOString(), path, (val as any).before, (val as any).after]
              .map(escape)
              .join(',')
          );
        });
      });
    }

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claim-${this.claimId}-history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ----- PDF export -----
  private downloadPdf(): void {
    const pdf = this.buildPdf();
    pdf.save(`claim-${this.claimId}-history.pdf`);
  }

  private buildPdf(): jsPDF {
    // Landscape for wider audit/diff columns
    const pdf = new jsPDF({
      unit: 'pt',
      format: 'letter',
      orientation: 'landscape',
    });
    const marginX = 32;
    let cursorY = 40;
    const headStyles: any = {
      fillColor: [245, 245, 245] as [number, number, number],
      textColor: 0,
      fontStyle: 'bold',
    };
    const bodyStyles = { fontSize: 9, cellPadding: 4 } as any;
    const addHeader = () => {
      pdf.setFontSize(18);
      pdf.text(`History for Claim ${this.claimId}`, marginX, cursorY);
      cursorY += 18;
      pdf.setFontSize(9);
      pdf.setTextColor(80);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, marginX, cursorY);
      pdf.setTextColor(0);
      cursorY += 14;
    };
    const ensureSpace = (needed: number = 60) => {
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (cursorY + needed > pageHeight - 40) {
        pdf.addPage();
        cursorY = 40;
        addHeader();
      }
    };
    addHeader();

    // Primary events table (summary)
    ensureSpace();
    pdf.setFontSize(12);
    pdf.text('Audit Events Summary', marginX, cursorY);
    cursorY += 10;
    autoTable(pdf, {
      startY: cursorY,
      head: [
        [
          'At',
          'By',
          'Role',
          'Action',
          'Details',
          'Diff Cnt',
          'Hash',
          'Prev Hash',
        ],
      ],
      body: this.events.map((ev) => [
        ev.at.toISOString(),
        ev.by,
        ev.role || '',
        ev.action,
        (ev.details || '').slice(0, 140),
        ev.diff ? Object.keys(ev.diff).length : 0,
        ev.hash || '',
        ev.prevHash || '',
      ]),
      margin: { left: marginX, right: marginX },
      styles: bodyStyles,
      headStyles,
      theme: 'grid',
      didDrawPage: (data) => {
        const cy = (data as any).cursor?.y;
        if (typeof cy === 'number') cursorY = cy + 8;
      },
    });

    // Field-level diff tables (only for events that have changes)
    this.events.forEach((ev) => {
      if (!ev.diff || !Object.keys(ev.diff).length) return;
      ensureSpace();
      pdf.setFontSize(11);
      pdf.text(
        `Field Changes @ ${ev.at.toISOString()} (${ev.action})`,
        marginX,
        cursorY
      );
      cursorY += 10;
      autoTable(pdf, {
        startY: cursorY,
        head: [['Field', 'Before', 'After']],
        body: Object.entries(ev.diff).map(([path, v]) => [
          path,
          String((v as any).before ?? ''),
          String((v as any).after ?? ''),
        ]),
        margin: { left: marginX, right: marginX },
        styles: bodyStyles,
        headStyles,
        theme: 'grid',
        didDrawPage: (data) => {
          const cy = (data as any).cursor?.y;
          if (typeof cy === 'number') cursorY = cy + 8;
        },
      });
    });

    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(120);
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pdf.internal.pageSize.getWidth() - 80,
        pdf.internal.pageSize.getHeight() - 20
      );
      pdf.setTextColor(0);
    }
    return pdf;
  }
}
