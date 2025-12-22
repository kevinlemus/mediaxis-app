import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.css'],
})
export class ComplianceComponent {
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
    console.log('Download audit packet (dummy)');
  }
}
