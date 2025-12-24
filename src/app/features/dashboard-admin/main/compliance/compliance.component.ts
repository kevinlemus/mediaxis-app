import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuditPacketService } from './audit-packet/audit-packet.service';
import { AuditPacketComponent } from './audit-packet/audit-packet.component'; // ✅ REQUIRED

type ComplianceStatus = 'Pass' | 'Warning' | 'Fail';

interface ComplianceItem {
  name: string;
  status: ComplianceStatus;
  details: string;
}

interface ComplianceAlert {
  severity: 'Low' | 'Medium' | 'High';
  message: string;
}

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    AuditPacketComponent, // ✅ REQUIRED FOR <app-audit-packet>
  ],
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.css'],
})
export class ComplianceComponent {

  @ViewChild('packetContainer') packetContainer!: ElementRef;

  constructor(private auditPacketService: AuditPacketService) { }

  auditReady = true;
  lastAuditDate = 'Jan 5, 2025';
  lastAuditBy = 'Internal security review';

  checks: ComplianceItem[] = [
    { name: 'Encryption at Rest', status: 'Pass', details: 'AES-256 applied to PHI storage.' },
    { name: 'Access Logging', status: 'Pass', details: 'All claim views recorded with user ID and timestamp.' },
    { name: 'Password Policy', status: 'Warning', details: '8 character minimum; recommend MFA enforcement.' },
    { name: 'Session Timeout', status: 'Pass', details: 'Auto logout after 15 minutes idle.' },
  ];

  alerts: ComplianceAlert[] = [
    { severity: 'Medium', message: '2 auditor accounts without recent logins.' },
  ];

  downloadPacket(): void {
    const container: HTMLElement = this.packetContainer?.nativeElement;
    const packetEl = container?.querySelector('app-audit-packet') as HTMLElement | null;
    if (packetEl) {
      this.auditPacketService.generatePdf(packetEl);
    } else {
      // Fallback: export container if packet element not found
      this.auditPacketService.generatePdf(container);
    }
  }
}
