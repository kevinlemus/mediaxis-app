import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  Claim,
  AuditEvent,
  InsuranceInfo,
  CoordinationOfBenefits,
} from '../../../core/models/claim.model';

type ClaimStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Accepted'
  | 'Approved'
  | 'Denied'
  | 'Rejected'
  | 'Pending Info'
  | 'Pending Payer'
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
  isPrintMode = false;

  // Simple UI helpers
  pointerLabels = 'ABCDEFGHIJKL'.split(''); // CMS-1500 diag pointer slots
  maxModifiers = 4;

  constructor(private route: ActivatedRoute, private router: Router) {}

ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    this.routeClaimId = id;
    if (id) this.loadClaim(id);
  });

  this.route.url.subscribe(segments => {
    this.isPrintMode = segments.some(s => s.path === 'print');
    if (this.isPrintMode) {
      setTimeout(() => window.print(), 500);
    }
  });
}


  // ----- Load mock claim (clinic-ready fields populated) -----
  private loadClaim(id: string): void {
    this.claim = {
      metadata: {
        claimId: id,
        claimType: 'Professional',
        createdAt: new Date('2025-11-10T09:20:00Z'),
        submittedAt: new Date('2025-11-11T10:00:00Z'),
        lastUpdatedAt: new Date(),
        submittedBy: 'j.smith',
        encounterId: 'ENC-001',
        // Auth/referral surfaced for usability
        priorAuthRequired: true,
        priorAuthNumber: 'PA-556677',
        referralRequired: true,
        referralNumber: 'REF-998877',
        // EDI tracking (optional)
        clearinghouseRef: 'CH-2025-001',
        payerClaimRef: 'PAYER-XYZ-123',
        x12Transaction837Id: '837-CTRL-0001',
        x12Transaction835Id: undefined,
      },
      patient: {
        mrn: 'MRN-001',
        firstName: 'John',
        lastName: 'Doe',
        dob: new Date('1985-03-04'),
        gender: 'Male',
        phone: '(317) 555-0123',
        email: 'john.doe@example.com',
        addressLine1: '123 Maple St',
        city: 'Indianapolis',
        state: 'IN',
        zip: '46204',
      },
      provider: {
        renderingProviderName: 'Dr. Alice Gomez',
        renderingNPI: '1234567890',
        billingProviderName: 'Metro Clinic LLC',
        billingNPI: '0987654321',
        facilityName: 'Metro Clinic Main',
        facilityNPI: '1122334455',
        facilityAddress: '200 Health Ave, Indianapolis, IN 46204',
        taxonomyCode: '207Q00000X',
        specialtyCode: '01', // example CMS specialty code
        referringProviderName: 'Dr. Brian Lee',
        referringNPI: '5566778899',
      },
      insurance: {
        payerName: 'BlueCross',
        payerId: 'BC123',
        planType: 'PPO',
        policyNumber: 'POL-123',
        groupNumber: 'GRP-777',
        subscriberName: 'John Doe',
        subscriberId: 'SUB-98765',
        relationshipToSubscriber: 'Self',
      },
      secondaryInsurance: {
        payerName: 'Medicare',
        payerId: 'MC001',
        planType: 'Medicare',
        policyNumber: 'MED-555',
        subscriberName: 'John Doe',
        subscriberId: 'SUB-98765',
        relationshipToSubscriber: 'Self',
      } as InsuranceInfo,
      coordinationOfBenefits: {
        hasSecondaryInsurance: true,
        sequence: ['Primary', 'Secondary'],
        primaryPayerPaidAmount: 0,
        secondaryExpectedAmount: 0,
        notes: 'Secondary to Medicare for deductible/coinsurance handling',
      } as CoordinationOfBenefits,
      status: 'Rejected',
      dateOfService: new Date('2025-11-10'),
      diagnoses: [
        { code: 'J06.9', description: 'Acute URI', primary: true },
        { code: 'R05.9', description: 'Cough, unspecified', primary: false },
      ],
      serviceLines: [
        {
          cptCode: '99213',
          modifier1: '25',
          units: 1,
          chargeAmount: 150,
          diagnosisPointers: ['A'], // points to first diagnosis
          placeOfService: '11',
        },
        {
          cptCode: 'J1100',
          units: 2,
          chargeAmount: 45,
          diagnosisPointers: ['A', 'B'],
          placeOfService: '11',
          ndcCode: '00006-3027-02',
        },
      ],
      financials: {
        totalCharge: 195,
        balance: 195,
        adjustments: [],
      },
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
    };
  }

  // ----- Edit workflow -----
  enableEdit(): void {
    if (
      !this.claim ||
      (this.claim.status !== 'Rejected' && this.claim.status !== 'Denied')
    )
      return;
    this.editMode = true;
    this.workingCopy = JSON.parse(JSON.stringify(this.claim));
    this.logAudit(
      'Edited',
      `Edit initiated for claim ${this.claim?.metadata.claimId}`
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
    const validationErrors = this.validateClaim(this.workingCopy);
    if (validationErrors.length) {
      this.logAudit(
        'Edited',
        `Validation failed: ${validationErrors.join('; ')}`
      );
      alert(
        'Please fix validation errors:\n' +
          validationErrors.map((e) => `• ${e}`).join('\n')
      );
      return;
    }

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
      const validationErrors = this.validateClaim(this.workingCopy);
      if (validationErrors.length) {
        this.logAudit(
          'Edited',
          `Validation failed before resubmission: ${validationErrors.join(
            '; '
          )}`
        );
        alert(
          'Please fix validation errors:\n' +
            validationErrors.map((e) => `• ${e}`).join('\n')
        );
        return;
      }

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

  // ----- Diagnostics & validation (clinic-ready rules) -----
  private validateClaim(c: Claim): string[] {
    const errors: string[] = [];

    // Patient basics
    if (!c.patient.firstName || !c.patient.lastName || !c.patient.dob) {
      errors.push('Missing patient name or date of birth');
    }

    // Insurance basics
    if (!c.insurance.payerName || !c.insurance.policyNumber) {
      errors.push('Primary insurance payer and policy number are required');
    }

    // Provider NPIs
    const isValidNpi = (npi?: string) => !!npi && /^\d{10}$/.test(npi);
    if (!isValidNpi(c.provider.renderingNPI))
      errors.push('Rendering NPI must be 10 digits');
    if (c.provider.billingNPI && !isValidNpi(c.provider.billingNPI))
      errors.push('Billing NPI must be 10 digits when provided');
    if (c.provider.referringNPI && !isValidNpi(c.provider.referringNPI))
      errors.push('Referring NPI must be 10 digits when provided');

    // Diagnoses: must have at least 1, and exactly one primary
    const primaries = (c.diagnoses || []).filter((d) => d.primary);
    if (!c.diagnoses?.length)
      errors.push('At least one diagnosis (ICD-10) is required');
    if (primaries.length !== 1)
      errors.push('Exactly one primary diagnosis must be selected');

    // Service lines: CPT present, charges non-negative, pointers valid, modifiers <= 4
    const validPointerLabels = this.pointerLabels;
    c.serviceLines.forEach((sl, idx) => {
      if (!sl.cptCode)
        errors.push(`Service line ${idx + 1}: CPT code is required`);
      if (sl.chargeAmount == null || sl.chargeAmount < 0)
        errors.push(`Service line ${idx + 1}: charge amount must be >= 0`);
      if (!sl.units || sl.units <= 0)
        errors.push(`Service line ${idx + 1}: units must be >= 1`);

      // diagnosis pointers must reference available labels within A–L AND map to actual diagnoses index
      if (!sl.diagnosisPointers?.length) {
        errors.push(
          `Service line ${
            idx + 1
          }: at least one diagnosis pointer (A–L) is required`
        );
      } else if (
        sl.diagnosisPointers.some((p) => !validPointerLabels.includes(p))
      ) {
        errors.push(
          `Service line ${idx + 1}: diagnosis pointers must be within A–L`
        );
      } else {
        const maxIndex = c.diagnoses.length - 1;
        const pointerIndexes = sl.diagnosisPointers.map((p) =>
          validPointerLabels.indexOf(p)
        );
        if (pointerIndexes.some((pi) => pi < 0 || pi > maxIndex)) {
          errors.push(
            `Service line ${
              idx + 1
            }: diagnosis pointer references a non-existent diagnosis`
          );
        }
      }

      // modifiers cap
      const modifiers = [
        sl.modifier1,
        sl.modifier2,
        sl.modifier3,
        sl.modifier4,
      ].filter(Boolean);
      if (modifiers.length > this.maxModifiers) {
        errors.push(
          `Service line ${idx + 1}: maximum of ${
            this.maxModifiers
          } modifiers allowed`
        );
      }
    });

    // Prior auth / referral conditional
    if (c.metadata.priorAuthRequired && !c.metadata.priorAuthNumber)
      errors.push('Prior authorization number is required');
    if (c.metadata.referralRequired && !c.metadata.referralNumber)
      errors.push('Referral number is required');

    // COB checks
    if (
      c.secondaryInsurance ||
      c.coordinationOfBenefits?.hasSecondaryInsurance
    ) {
      const primaryPaid = c.coordinationOfBenefits?.primaryPayerPaidAmount ?? 0;
      if (primaryPaid < 0)
        errors.push('Primary payer paid amount cannot be negative');
    }

    return errors;
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

    // Top-level fields
    compare('status', b.status, a.status);
    compare('dateOfService', b.dateOfService, a.dateOfService);

    // Metadata (including auth/referral and EDI)
    if (b.metadata && a.metadata)
      for (const key of Object.keys(a.metadata))
        compare(`metadata.${key}`, b.metadata[key], a.metadata[key]);

    // Patient
    if (b.patient && a.patient)
      for (const key of Object.keys(a.patient))
        compare(`patient.${key}`, b.patient[key], a.patient[key]);

    // Provider (includes referring, taxonomy, specialty)
    if (b.provider && a.provider)
      for (const key of Object.keys(a.provider))
        compare(`provider.${key}`, b.provider[key], a.provider[key]);

    // Insurance (primary)
    if (b.insurance && a.insurance)
      for (const key of Object.keys(a.insurance))
        compare(`insurance.${key}`, b.insurance[key], a.insurance[key]);

    // Secondary insurance
    compare('secondaryInsurance', b.secondaryInsurance, a.secondaryInsurance);

    // COB
    compare(
      'coordinationOfBenefits',
      b.coordinationOfBenefits,
      a.coordinationOfBenefits
    );

    // Clinical & financials
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
    if (!this.workingCopy) return;
    const wasPrimary = this.workingCopy.diagnoses[i]?.primary;
    this.workingCopy.diagnoses = this.workingCopy.diagnoses.filter(
      (_, idx) => idx !== i
    );
    // If primary removed, set first remaining as primary to satisfy validation quickly
    if (wasPrimary && this.workingCopy.diagnoses.length) {
      this.workingCopy.diagnoses = this.workingCopy.diagnoses.map(
        (dx, idx) => ({
          ...dx,
          primary: idx === 0,
        })
      );
    }
  }

  setPrimaryDiagnosis(i: number): void {
    if (!this.workingCopy) return;
    this.workingCopy.diagnoses = this.workingCopy.diagnoses.map((dx, idx) => ({
      ...dx,
      primary: idx === i,
    }));
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
    if (!this.workingCopy) return;
    this.workingCopy.serviceLines = this.workingCopy.serviceLines.filter(
      (_, idx) => idx !== i
    );
    this.recalcFinancials();
  }

  // Modifier helpers (keep max 4)
  setModifier(slIndex: number, modIndex: 1 | 2 | 3 | 4, value: string): void {
    if (!this.workingCopy) return;
    const sl = this.workingCopy.serviceLines[slIndex];
    if (!sl) return;
    const clean = (value || '').toUpperCase().trim();
    sl[`modifier${modIndex}`] = clean || undefined;
  }

  toggleDiagnosisPointer(slIndex: number, label: string): void {
    if (!this.workingCopy) return;
    const sl = this.workingCopy.serviceLines[slIndex];
    if (!sl) return;
    const set = new Set(sl.diagnosisPointers || []);
    if (set.has(label)) set.delete(label);
    else set.add(label);
    sl.diagnosisPointers = Array.from(set);
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

  downloadClaim(format: 'pdf' | 'csv') {
    if (!this.claim) return;
    window.open(
      `/api/claims/${this.claim.metadata.claimId}/export?format=${format}`,
      '_blank'
    );
  }

  printClaim() {
    if (!this.claim) return;
    window.open(
      `/dashboard-employee/claims/${this.claim.metadata.claimId}/print`,
      '_blank'
    );
  }

  viewHistory() {
    if (!this.claim) return;
    window.open(
      `/dashboard-employee/claims/${this.claim.metadata.claimId}/history`,
      '_blank'
    );
  }
}
