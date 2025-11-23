export type ClaimStatus =
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

export type ClaimType = 'Professional' | 'Institutional';

export interface PatientInfo {
  mrn: string;
  firstName: string;
  lastName: string;
  dob: Date;
  gender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  phone?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface ProviderInfo {
  renderingProviderName: string;
  renderingNPI: string;
  billingProviderName?: string;
  billingNPI?: string;
  taxonomyCode?: string;
  specialtyCode?: string; // NEW
  facilityName?: string;
  facilityNPI?: string;
  facilityAddress?: string;
  referringProviderName?: string; // NEW
  referringNPI?: string; // NEW
}

export interface InsuranceInfo {
  payerName: string;
  payerId?: string;
  planType?: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName?: string;
  subscriberId?: string;
  relationshipToSubscriber?: 'Self' | 'Spouse' | 'Child' | 'Other';
}

export interface ServiceLine {
  cptCode: string;
  modifier1?: string;
  modifier2?: string;
  modifier3?: string;
  modifier4?: string;
  units: number;
  chargeAmount: number;
  diagnosisPointers: string[];
  placeOfService?: string;
  renderingNPIOverride?: string;
  ndcCode?: string; // NEW
}

export interface Diagnosis {
  code: string;
  description?: string;
  primary?: boolean;
}

export interface Financials {
  totalCharge: number;
  allowedAmount?: number;
  paidAmount?: number;
  patientResponsibility?: number;
  adjustments?: {
    code: string;
    description?: string;
    amount: number;
  }[];
  balance?: number;
}

export interface SubmissionMetadata {
  claimId: string;
  encounterId?: string;
  claimType: ClaimType; // NEW
  createdAt: Date;
  submittedAt?: Date;
  lastUpdatedAt: Date;
  submittedBy: string;
  clearinghouseRef?: string;
  payerClaimRef?: string;
  x12Transaction837Id?: string;
  x12Transaction835Id?: string;
  priorAuthRequired?: boolean; // NEW
  priorAuthNumber?: string; // NEW
  referralRequired?: boolean; // NEW
  referralNumber?: string; // NEW
}

export interface PayerResponse {
  status?: ClaimStatus;
  reasonCode?: string;
  reasonDescription?: string;
  responseDate?: Date;
  notes?: string;
  remittanceAdviceId?: string;
}

export interface Attachment {
  id: string;
  type: 'ClinicalNote' | 'LabResult' | 'Image' | 'Other';
  filename: string;
  url?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface AuditEvent {
  at: Date;
  by: string;
  action:
    | 'Created'
    | 'Submitted'
    | 'Edited'
    | 'AttachmentAdded'
    | 'StatusChanged'
    | 'PaymentPosted'
    | 'AdjustmentApplied';
  details?: string;
  role?: string; // User role at event time
  diff?: Record<string, { before: unknown; after: unknown }>; // Field-level changes
  hash?: string; // Immutable event hash
  prevHash?: string; // Previous event hash
}

export interface CoordinationOfBenefits {
  hasSecondaryInsurance?: boolean;
  sequence?: ('Primary' | 'Secondary' | 'Tertiary')[];
  primaryPayerPaidAmount?: number;
  secondaryExpectedAmount?: number;
  notes?: string;
}

export interface Claim {
  metadata: SubmissionMetadata;
  patient: PatientInfo;
  provider: ProviderInfo;
  insurance: InsuranceInfo;
  secondaryInsurance?: InsuranceInfo; // NEW
  coordinationOfBenefits?: CoordinationOfBenefits; // NEW
  status: ClaimStatus;
  dateOfService: Date;
  diagnoses: Diagnosis[];
  serviceLines: ServiceLine[];
  financials: Financials;
  payerResponse?: PayerResponse;
  attachments?: Attachment[];
  auditTrail?: AuditEvent[];
}
