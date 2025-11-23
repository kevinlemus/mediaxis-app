import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  bannerMessage: string | null = null;
  bannerTimeoutHandle: any;
  bannerType: 'success' | 'danger' | null = null;

  // Simple UI helpers
  pointerLabels = 'ABCDEFGHIJKL'.split(''); // CMS-1500 diag pointer slots
  maxModifiers = 4;
  // Dropdown state removed; single automatic PDF export now.

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.routeClaimId = id;
      if (id) this.loadClaim(id);
    });

    this.route.url.subscribe((segments) => {
      this.isPrintMode = segments.some((s) => s.path === 'print');
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
    if (!this.claim || this.claim.status === 'Void') return;
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
    // Exit edit mode and show banner
    this.editMode = false;
    this.workingCopy = null;
    this.showBanner('Changes saved successfully', 'success');
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
    this.showBanner('Changes saved and claim resubmitted', 'success');
  }

  withdrawClaim(): void {
    if (!this.claim || this.claim.status === 'Void') return;
    const previousStatus = this.claim.status;
    this.claim.status = 'Void';
    this.claim.metadata.lastUpdatedAt = new Date();
    this.logAudit('StatusChanged', `Status changed ${previousStatus} -> Void`);
    this.showBanner('Claim withdrawn', 'danger');
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

  // Unified actions
  downloadClaim(format: 'pdf' | 'csv') {
    if (!this.claim) return;
    if (format === 'csv') this.downloadCsv();
    else this.downloadSummaryPdf();
  }

  printClaim() {
    if (!this.claim) return;
    this.printSummaryPdf();
  }

  viewHistory() {
    if (!this.claim) return;
    window.open(
      `/dashboard-employee/claims/${this.claim.metadata.claimId}/history`,
      '_blank'
    );
  }

  // ----- Download helpers (client-side) -----
  downloadCsv(): void {
    if (!this.claim) return;
    const c = this.claim;
    const escape = (v: any) => {
      const s = v == null ? '' : String(v).replace(/\r?\n+/g, ' ');
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };

    const lines: string[] = [];
    const pushSectionHeader = (title: string) => lines.push(`# ${title}`);

    pushSectionHeader('Claim');
    lines.push(['Claim ID', c.metadata.claimId].map(escape).join(','));
    lines.push(['Status', c.status].map(escape).join(','));
    lines.push(['Type', c.metadata.claimType].map(escape).join(','));
    lines.push(
      ['Date of Service', c.dateOfService.toISOString()].map(escape).join(',')
    );

    pushSectionHeader('Patient');
    lines.push(['MRN', c.patient.mrn].map(escape).join(','));
    lines.push(
      ['Name', `${c.patient.firstName} ${c.patient.lastName}`]
        .map(escape)
        .join(',')
    );
    lines.push(['DOB', c.patient.dob.toISOString()].map(escape).join(','));
    if (c.patient.gender)
      lines.push(['Gender', c.patient.gender].map(escape).join(','));

    pushSectionHeader('Provider');
    lines.push(
      [
        'Rendering Provider',
        c.provider.renderingProviderName,
        c.provider.renderingNPI,
      ]
        .map(escape)
        .join(',')
    );
    if (c.provider.billingProviderName)
      lines.push(
        [
          'Billing Provider',
          c.provider.billingProviderName,
          c.provider.billingNPI,
        ]
          .map(escape)
          .join(',')
      );
    if (c.provider.facilityName)
      lines.push(
        ['Facility', c.provider.facilityName, c.provider.facilityNPI]
          .map(escape)
          .join(',')
      );

    pushSectionHeader('Insurance');
    lines.push(['Payer', c.insurance.payerName].map(escape).join(','));
    lines.push(['Policy', c.insurance.policyNumber].map(escape).join(','));
    if (c.insurance.groupNumber)
      lines.push(['Group', c.insurance.groupNumber].map(escape).join(','));
    if (c.insurance.subscriberName)
      lines.push(
        ['Subscriber', c.insurance.subscriberName].map(escape).join(',')
      );

    if (c.secondaryInsurance) {
      pushSectionHeader('Secondary Insurance');
      lines.push(
        ['Payer', c.secondaryInsurance.payerName].map(escape).join(',')
      );
      lines.push(
        ['Policy', c.secondaryInsurance.policyNumber].map(escape).join(',')
      );
    }

    pushSectionHeader('Diagnoses');
    lines.push(['Code', 'Description', 'Primary'].map(escape).join(','));
    (c.diagnoses || []).forEach((dx) => {
      lines.push(
        [dx.code, dx.description, dx.primary ? 'Yes' : 'No']
          .map(escape)
          .join(',')
      );
    });

    pushSectionHeader('Service Lines');
    lines.push(
      ['CPT', 'Units', 'Charge', 'POS', 'Modifiers', 'Dx Pointers', 'NDC']
        .map(escape)
        .join(',')
    );
    (c.serviceLines || []).forEach((sl) => {
      const mods = [sl.modifier1, sl.modifier2, sl.modifier3, sl.modifier4]
        .filter(Boolean)
        .join('|');
      lines.push(
        [
          sl.cptCode,
          sl.units,
          sl.chargeAmount,
          sl.placeOfService || '',
          mods,
          (sl.diagnosisPointers || []).join('|'),
          sl.ndcCode || '',
        ]
          .map(escape)
          .join(',')
      );
    });

    pushSectionHeader('Financials');
    lines.push(
      ['Total Charge', c.financials.totalCharge].map(escape).join(',')
    );
    if (c.financials.allowedAmount != null)
      lines.push(['Allowed', c.financials.allowedAmount].map(escape).join(','));
    if (c.financials.paidAmount != null)
      lines.push(['Paid', c.financials.paidAmount].map(escape).join(','));
    if (c.financials.patientResponsibility != null)
      lines.push(
        ['Patient Responsibility', c.financials.patientResponsibility]
          .map(escape)
          .join(',')
      );
    if (c.financials.balance != null)
      lines.push(['Balance', c.financials.balance].map(escape).join(','));

    if (c.auditTrail?.length) {
      pushSectionHeader('Audit Trail');
      lines.push(['At', 'By', 'Action', 'Details'].map(escape).join(','));
      c.auditTrail.forEach((ev) => {
        lines.push(
          [ev.at.toISOString(), ev.by, ev.action, ev.details || '']
            .map(escape)
            .join(',')
        );
      });
    }

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claim-${c.metadata.claimId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Removed legacy HTML print approach; unified PDF generation instead.

  // Automatic PDF download (summary) without opening print dialog
  async downloadSummaryPdf(): Promise<void> {
    if (!this.claim) return;
    const pdf = this.buildPdf();
    pdf.save(`claim-${this.claim.metadata.claimId}-summary.pdf`);
  }

  private printSummaryPdf(): void {
    if (!this.claim) return;
    const pdf = this.buildPdf();
    // Auto print: open in new window then trigger browser print dialog
    pdf.autoPrint();
    const blobUrl = pdf.output('bloburl');
    window.open(blobUrl, '_blank');
  }

  private buildPdf(): jsPDF {
    const c = this.claim!;
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
    const marginX = 32;
    let cursorY = 40;
    const headStyles: any = {
      fillColor: [245, 245, 245] as [number, number, number],
      textColor: 0,
      fontStyle: 'bold',
    };
    const bodyStyles = { fontSize: 9, cellPadding: 4 };
    const smallBodyStyles = { fontSize: 8, cellPadding: 3 };

    const addHeader = () => {
      pdf.setFontSize(18);
      pdf.text(`Claim ${c.metadata.claimId}`, marginX, cursorY);
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

    const sectionTable = (title: string, rows: [string, any][]) => {
      ensureSpace();
      pdf.setFontSize(12);
      pdf.text(title, marginX, cursorY);
      cursorY += 10;
      autoTable(pdf, {
        startY: cursorY,
        head: [['Field', 'Value']],
        body: rows.map((r) => [r[0], r[1] == null ? '' : String(r[1])]),
        margin: { left: marginX, right: marginX },
        styles: bodyStyles,
        headStyles,
        theme: 'grid',
        didDrawPage: (data) => {
          const cy = (data as any).cursor?.y;
          if (typeof cy === 'number') cursorY = cy + 8;
        },
      });
    };

    sectionTable('Claim', [
      ['Status', c.status],
      ['Type', c.metadata.claimType],
      ['Date of Service', c.dateOfService.toISOString().substring(0, 10)],
      ['Submitted At', c.metadata.submittedAt?.toISOString() || ''],
      ['Last Updated', c.metadata.lastUpdatedAt?.toISOString() || ''],
    ]);
    sectionTable('Patient', [
      ['MRN', c.patient.mrn],
      ['Name', `${c.patient.firstName} ${c.patient.lastName}`],
      ['DOB', c.patient.dob.toISOString().substring(0, 10)],
      ['Gender', c.patient.gender || ''],
    ]);
    sectionTable('Provider', [
      [
        'Rendering',
        `${c.provider.renderingProviderName} (NPI ${c.provider.renderingNPI})`,
      ],
      [
        'Billing',
        c.provider.billingProviderName
          ? `${c.provider.billingProviderName} (NPI ${c.provider.billingNPI})`
          : '',
      ],
      [
        'Facility',
        c.provider.facilityName
          ? `${c.provider.facilityName} (NPI ${c.provider.facilityNPI})`
          : '',
      ],
      [
        'Referring',
        c.provider.referringProviderName
          ? `${c.provider.referringProviderName} (NPI ${c.provider.referringNPI})`
          : '',
      ],
    ]);
    sectionTable('Primary Insurance', [
      ['Payer', c.insurance.payerName],
      ['Policy', c.insurance.policyNumber],
      ['Group', c.insurance.groupNumber || ''],
      ['Subscriber', c.insurance.subscriberName || ''],
      ['Relationship', c.insurance.relationshipToSubscriber || ''],
    ]);
    if (c.secondaryInsurance) {
      sectionTable('Secondary Insurance', [
        ['Payer', c.secondaryInsurance.payerName],
        ['Policy', c.secondaryInsurance.policyNumber],
        ['Subscriber', c.secondaryInsurance.subscriberName || ''],
        ['Relationship', c.secondaryInsurance.relationshipToSubscriber || ''],
      ]);
    }

    ensureSpace();
    pdf.setFontSize(12);
    pdf.text('Diagnoses', marginX, cursorY);
    cursorY += 10;
    autoTable(pdf, {
      startY: cursorY,
      head: [['#', 'Code', 'Description', 'Primary']],
      body: (c.diagnoses || []).map((d, i) => [
        String(i + 1),
        d.code || '',
        d.description || '',
        d.primary ? 'Yes' : 'No',
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

    ensureSpace();
    pdf.setFontSize(12);
    pdf.text('Service Lines', marginX, cursorY);
    cursorY += 10;
    autoTable(pdf, {
      startY: cursorY,
      head: [
        ['#', 'CPT', 'Units', 'Charge', 'POS', 'Modifiers', 'Dx Ptrs', 'NDC'],
      ],
      body: (c.serviceLines || []).map((sl, i) => [
        String(i + 1),
        sl.cptCode,
        String(sl.units),
        `$${sl.chargeAmount}`,
        sl.placeOfService || '',
        [sl.modifier1, sl.modifier2, sl.modifier3, sl.modifier4]
          .filter(Boolean)
          .join(' | '),
        (sl.diagnosisPointers || []).join(' | '),
        sl.ndcCode || '',
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

    sectionTable('Financials', [
      ['Total Charge', `$${c.financials.totalCharge}`],
      [
        'Allowed',
        c.financials.allowedAmount != null
          ? `$${c.financials.allowedAmount}`
          : '',
      ],
      [
        'Paid',
        c.financials.paidAmount != null ? `$${c.financials.paidAmount}` : '',
      ],
      [
        'Patient Responsibility',
        c.financials.patientResponsibility != null
          ? `$${c.financials.patientResponsibility}`
          : '',
      ],
      [
        'Balance',
        c.financials.balance != null ? `$${c.financials.balance}` : '',
      ],
    ]);

    if (c.auditTrail?.length) {
      ensureSpace();
      pdf.setFontSize(12);
      pdf.text('Audit Trail', marginX, cursorY);
      cursorY += 10;
      autoTable(pdf, {
        startY: cursorY,
        head: [['At', 'By', 'Action', 'Details']],
        body: c.auditTrail.map((ev) => [
          ev.at.toISOString(),
          ev.by,
          ev.action,
          (ev.details || '').slice(0, 140),
        ]),
        margin: { left: marginX, right: marginX },
        styles: smallBodyStyles,
        headStyles,
        theme: 'grid',
        didDrawPage: (data) => {
          const cy = (data as any).cursor?.y;
          if (typeof cy === 'number') cursorY = cy + 8;
        },
      });
    }

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

  private showBanner(
    message: string,
    type: 'success' | 'danger' = 'success'
  ): void {
    this.bannerMessage = message;
    this.bannerType = type;
    if (this.bannerTimeoutHandle) clearTimeout(this.bannerTimeoutHandle);
    this.bannerTimeoutHandle = setTimeout(() => {
      this.bannerMessage = null;
      this.bannerType = null;
    }, 6000);
  }

  // Build HTML summary identical to print view (without auto print script)
  private buildSummaryHtml(): string {
    const c = this.claim!;
    const esc = (v: any) => (v == null ? '' : String(v));
    const style = `
      body { font-family: Segoe UI, Arial, sans-serif; margin:0; padding:16px; }
      h1 { font-size:20px; margin:0 0 8px; }
      h2 { font-size:16px; margin:24px 0 8px; border-bottom:1px solid #ccc; padding-bottom:4px; }
      table { width:100%; border-collapse:collapse; margin-bottom:12px; }
      th, td { border:1px solid #ddd; padding:4px 6px; font-size:12px; text-align:left; }
      th { background:#f5f5f5; }
      .meta { font-size:12px; color:#555; margin-bottom:16px; }
    `;
    const sectionTable = (title: string, rows: [string, any][]) =>
      `<h2>${esc(title)}</h2><table><tbody>${rows
        .map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`)
        .join('')}</tbody></table>`;
    const diagTable = `<h2>Diagnoses</h2><table><thead><tr><th>Code</th><th>Description</th><th>Primary</th></tr></thead><tbody>${(
      c.diagnoses || []
    )
      .map(
        (d) =>
          `<tr><td>${esc(d.code)}</td><td>${esc(d.description)}</td><td>${
            d.primary ? 'Yes' : 'No'
          }</td></tr>`
      )
      .join('')}</tbody></table>`;
    const slTable = `<h2>Service Lines</h2><table><thead><tr><th>CPT</th><th>Units</th><th>Charge</th><th>POS</th><th>Modifiers</th><th>Dx Ptrs</th><th>NDC</th></tr></thead><tbody>${(
      c.serviceLines || []
    )
      .map((sl) => {
        const mods = [sl.modifier1, sl.modifier2, sl.modifier3, sl.modifier4]
          .filter(Boolean)
          .join(' | ');
        return `<tr><td>${esc(sl.cptCode)}</td><td>${esc(
          sl.units
        )}</td><td>${esc(sl.chargeAmount)}</td><td>${esc(
          sl.placeOfService || ''
        )}</td><td>${esc(mods)}</td><td>${(sl.diagnosisPointers || []).join(
          ' | '
        )}</td><td>${esc(sl.ndcCode || '')}</td></tr>`;
      })
      .join('')}</tbody></table>`;
    const auditTable = c.auditTrail?.length
      ? `<h2>Audit Trail</h2><table><thead><tr><th>At</th><th>By</th><th>Action</th><th>Details</th></tr></thead><tbody>${c.auditTrail
          .map(
            (ev) =>
              `<tr><td>${ev.at.toISOString()}</td><td>${esc(
                ev.by
              )}</td><td>${esc(ev.action)}</td><td>${esc(
                ev.details || ''
              )}</td></tr>`
          )
          .join('')}</tbody></table>`
      : '';
    return `<!DOCTYPE html><html><head><meta charset='utf-8'/><style>${style}</style></head><body>
      <h1>Claim ${esc(c.metadata.claimId)}</h1>
      <div class="meta">Generated: ${new Date().toLocaleString()}</div>
      ${sectionTable('Claim', [
        ['Status', c.status],
        ['Type', c.metadata.claimType],
        ['Date of Service', c.dateOfService.toISOString()],
        ['Submitted At', c.metadata.submittedAt?.toISOString() || ''],
        ['Last Updated', c.metadata.lastUpdatedAt?.toISOString() || ''],
      ])}
      ${sectionTable('Patient', [
        ['MRN', c.patient.mrn],
        ['Name', c.patient.firstName + ' ' + c.patient.lastName],
        ['DOB', c.patient.dob.toISOString()],
        ['Gender', c.patient.gender || ''],
      ])}
      ${sectionTable('Provider', [
        [
          'Rendering',
          c.provider.renderingProviderName +
            ' (NPI ' +
            c.provider.renderingNPI +
            ')',
        ],
        [
          'Billing',
          c.provider.billingProviderName
            ? c.provider.billingProviderName +
              ' (NPI ' +
              c.provider.billingNPI +
              ')'
            : '',
        ],
        [
          'Facility',
          c.provider.facilityName
            ? c.provider.facilityName + ' (NPI ' + c.provider.facilityNPI + ')'
            : '',
        ],
      ])}
      ${sectionTable('Primary Insurance', [
        ['Payer', c.insurance.payerName],
        ['Policy', c.insurance.policyNumber],
        ['Group', c.insurance.groupNumber || ''],
      ])}
      ${
        c.secondaryInsurance
          ? sectionTable('Secondary Insurance', [
              ['Payer', c.secondaryInsurance.payerName],
              ['Policy', c.secondaryInsurance.policyNumber],
            ])
          : ''
      }
      ${diagTable}
      ${slTable}
      ${sectionTable('Financials', [
        ['Total Charge', c.financials.totalCharge],
        ['Allowed', c.financials.allowedAmount ?? ''],
        ['Paid', c.financials.paidAmount ?? ''],
        ['Patient Responsibility', c.financials.patientResponsibility ?? ''],
        ['Balance', c.financials.balance ?? ''],
      ])}
      ${auditTable}
    </body></html>`;
  }
}
