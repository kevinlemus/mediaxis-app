import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface ComplianceItem { name: string; status: 'Pass' | 'Warning' | 'Fail'; details: string; }

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.css'],
})

export class ComplianceComponent {
  auditReady = true;
  checks: ComplianceItem[] = [
    { name: 'Encryption at Rest', status: 'Pass', details: 'AES-256 applied to PHI storage.' },
    { name: 'Access Logging', status: 'Pass', details: 'All claim views recorded.' },
    { name: 'Password Policy', status: 'Warning', details: '8 char min; recommend MFA enforcement.' },
    { name: 'Session Timeout', status: 'Pass', details: 'Auto logout after 15 minutes idle.' },
  ];
  alerts = [
    { severity: 'Medium', message: '2 auditor accounts without recent logins.' },
  ];

  downloadPacket(): void { console.log('Download audit packet (dummy)'); }
}
