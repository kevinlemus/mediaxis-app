import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Claim, AuditEvent } from '../../../core/models/claim.model';

type ClaimStatus =
  | 'Submitted'
  | 'In Review'
  | 'Approved'
  | 'Rejected'
  | 'Denied'
  | 'Paid'
  | 'Partially Paid'
  | 'Adjusted'
  | 'Void';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  claim: Claim | null = null;
  editMode = false;
  workingCopy: Claim | null = null;
  currentUser = 'j.smith';
  routeClaimId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.routeClaimId = id;
      if (id) this.loadClaim(id);
    });
  }

  private loadClaim(id: string): void {
    this.claim = {
      metadata: {
        claimId: id,
        createdAt: new Date('2025-11-10T09:20:00Z'),
        submittedAt: new Date('2025-11-11T10:00:00Z'),
        lastUpdatedAt: new Date(),
        submittedBy: 'j.smith',
        encounterId: 'ENC-001',
      },
      patient: {
        mrn: 'MRN-001',
        firstName: 'John',
        lastName: 'Doe',
        dob: new Date('1985-03-04'),
        gender: 'Male',
      },
      provider: {
        renderingProviderName: 'Dr. Alice Gomez',
        renderingNPI: '1234567890',
        billingProviderName: 'Metro Clinic LLC',
        billingNPI: '0987654321',
        facilityName: 'Metro Clinic Main',
        facilityNPI: '1122334455',
      },
      insurance: {
        payerName: 'BlueCross',
        policyNumber: 'POL-123',
        groupNumber: 'GRP-777',
        subscriberName: 'John Doe',
        relationshipToSubscriber: 'Self',
      },
      status: 'Rejected',
      dateOfService: new Date('2025-11-10'),
      diagnoses: [{ code: 'J06.9', description: 'Acute URI', primary: true }],
      serviceLines: [
        {
          cptCode: '99213',
          units: 1,
          chargeAmount: 150,
          diagnosisPointers: ['A'],
          placeOfService: '11',
        },
      ],
      financials: { totalCharge: 150, balance: 150 },
      payerResponse: {
        status: 'Rejected',
        reasonCode: 'CO-16',
        reasonDescription: 'Claim lacks required information',
        remittanceAdviceId: undefined,
        notes: 'Please correct insurance policy number and resubmit.',
      },
      attachments: [],
      auditTrail: [
        {
          at: new Date('2025-11-10T09:20:00Z'),
          by: 'j.smith',
          action: 'Created',
          details: '',
        },
        {
          at: new Date('2025-11-11T10:00:00Z'),
          by: 'j.smith',
          action: 'Submitted',
          details: '',
        },
      ],
      compliance: { hipaaOk: true },
    };
  }

  // ----- Edit workflow -----
  enableEdit(): void {
    if (!this.claim || this.claim.status !== 'Rejected') return;
    this.editMode = true;
    this.workingCopy = JSON.parse(JSON.stringify(this.claim));
    this.logAudit(
      'Edited',
      `Edit initiated for claim ${this.claim.metadata.claimId}`
    );
  }

  cancelEdit(): void {
    if (!this.claim) return;
    this.editMode = false;
    this.workingCopy = null;
    this.logAudit(
      'Edited',
      `Edit canceled for claim ${this.claim.metadata.claimId}`
    );
  }

  saveChanges(): void {
    if (!this.claim || !this.workingCopy) return;
    const before = JSON.parse(JSON.stringify(this.claim));
    const after = JSON.parse(JSON.stringify(this.workingCopy));
    this.claim = this.workingCopy;
    this.claim.metadata.lastUpdatedAt = new Date();
    const diff = this.computeDiff(before, after);
    this.logAudit(
      'Edited',
      `Changes saved to claim ${this.claim.metadata.claimId}`,
      diff
    );
  }

  saveAndResubmit(): void {
    if (!this.claim) return;
    if (this.editMode && this.workingCopy) {
      const before = JSON.parse(JSON.stringify(this.claim));
      const after = JSON.parse(JSON.stringify(this.workingCopy));
      this.claim = this.workingCopy;
      this.claim.metadata.lastUpdatedAt = new Date();
      const diff = this.computeDiff(before, after);
      this.logAudit(
        'Edited',
        `Changes saved prior to resubmission for claim ${this.claim.metadata.claimId}`,
        diff
      );
    }
    const previousStatus = this.claim.status;
    this.claim.status = 'Submitted';
    const resubmittedAt = new Date();
    this.claim.metadata.submittedAt = resubmittedAt;
    this.claim.payerResponse = {
      status: 'Submitted',
      reasonCode: undefined,
      reasonDescription: undefined,
      remittanceAdviceId: undefined,
      notes: 'Resubmitted after edits',
    };
    this.logAudit(
      'StatusChanged',
      `Status changed ${previousStatus} -> Submitted`
    );
    this.logAudit(
      'Submitted',
      `Claim ${this.claim.metadata.claimId} resubmitted`
    );
    this.editMode = false;
    this.workingCopy = null;
  }

  withdrawClaim(): void {
    if (!this.claim || this.claim.status === 'Void') return;
    const previousStatus = this.claim.status;
    this.claim.status = 'Void';
    this.claim.metadata.lastUpdatedAt = new Date();
    this.logAudit('StatusChanged', `Status changed ${previousStatus} -> Void`);
  }

  // ----- Audit utilities -----
  private logAudit(
    action: AuditEvent['action'],
    details: string,
    diff?: Record<string, unknown>
  ): void {
    if (!this.claim) return;
    const event: AuditEvent = {
      at: new Date(),
      by: this.currentUser,
      action,
      details,
    };
    if (diff) event.details += ' | Diff: ' + JSON.stringify(diff);
    this.claim.auditTrail = [...(this.claim.auditTrail || []), event];
  }

  private computeDiff(
    before: unknown,
    after: unknown
  ): Record<string, unknown> {
    const diff: Record<string, unknown> = {};
    const b = before as any,
      a = after as any;
    const compare = (path: string, valB: any, valA: any) => {
      const serialize = (v: any) => (v instanceof Date ? v.toISOString() : v);
      if (JSON.stringify(valB) !== JSON.stringify(valA))
        diff[path] = { before: serialize(valB), after: serialize(valA) };
    };
    compare('status', b.status, a.status);
    compare('dateOfService', b.dateOfService, a.dateOfService);
    if (b.insurance && a.insurance)
      for (const key of Object.keys(a.insurance))
        compare(`insurance.${key}`, b.insurance[key], a.insurance[key]);
    compare('diagnoses', b.diagnoses, a.diagnoses);
    compare('serviceLines', b.serviceLines, a.serviceLines);
    if (b.financials && a.financials)
      for (const key of Object.keys(a.financials))
        compare(`financials.${key}`, b.financials[key], a.financials[key]);
    if (b.payerResponse && a.payerResponse)
      for (const key of Object.keys(a.payerResponse))
        compare(
          `payerResponse.${key}`,
          b.payerResponse[key],
          a.payerResponse[key]
        );
    return diff;
  }

  // ----- Editable list helpers -----
  addDiagnosis(): void {
    if (!this.workingCopy) return;
    this.workingCopy.diagnoses = [
      ...(this.workingCopy.diagnoses || []),
      { code: '', description: '', primary: false },
    ];
  }
  removeDiagnosis(i: number): void {
    if (this.workingCopy)
      this.workingCopy.diagnoses = this.workingCopy.diagnoses.filter(
        (_, idx) => idx !== i
      );
  }
  setPrimaryDiagnosis(i: number): void {
    if (this.workingCopy)
      this.workingCopy.diagnoses = this.workingCopy.diagnoses.map(
        (dx, idx) => ({ ...dx, primary: idx === i })
      );
  }
  addServiceLine(): void {
    if (!this.workingCopy) return;
    this.workingCopy.serviceLines = [
      ...(this.workingCopy.serviceLines || []),
      {
        cptCode: '',
        units: 1,
        chargeAmount: 0,
        diagnosisPointers: [],
        placeOfService: '',
      },
    ];
    this.recalcFinancials();
  }
  removeServiceLine(i: number): void {
    if (this.workingCopy) {
      this.workingCopy.serviceLines = this.workingCopy.serviceLines.filter(
        (_, idx) => idx !== i
      );
      this.recalcFinancials();
    }
  }

  recalcFinancials(): void {
    if (!this.workingCopy) return;
    const total = (this.workingCopy.serviceLines || []).reduce(
      (sum, sl) => sum + (Number(sl.chargeAmount) || 0),
      0
    );
    this.workingCopy.financials.totalCharge = total;
    // For a rejected/unpaid claim, balance = total (until adjudication rules adjust it)
    this.workingCopy.financials.balance = total;
  }
}
