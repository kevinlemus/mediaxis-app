export type ClaimStatus =
  | 'Draft'
  | 'Submitted'
  | 'In Review'
  | 'Accepted'
  | 'Approved'          // ✅ added for consistency with your mock data
  | 'Denied'
  | 'Rejected'
  | 'Pending Info'
  | 'Pending Payer'
  | 'Paid'
  | 'Partially Paid'
  | 'Adjusted'
  | 'Void';

export interface PatientInfo {
  mrn: string;                 // Medical Record Number
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
  facilityName?: string;
  facilityNPI?: string;
  facilityAddress?: string;
}

export interface InsuranceInfo {
  payerName: string;
  payerId?: string;            // e.g., CMS payer ID
  planType?: string;           // PPO/HMO/etc.
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
  diagnosisPointers: string[]; // e.g., ['A','B'] pointing to ICD codes
  placeOfService?: string;     // e.g., 11 (office)
  renderingNPIOverride?: string;
}

export interface Diagnosis {
  code: string;                // ICD-10 code
  description?: string;
  primary?: boolean;
}

export interface Financials {
  totalCharge: number;
  allowedAmount?: number;
  paidAmount?: number;
  patientResponsibility?: number; // copay + coinsurance + deductible
  adjustments?: {
    code: string;              // CARC code
    description?: string;
    amount: number;
  }[];
  balance?: number;            // computed remaining balance
}

export interface SubmissionMetadata {
  claimId: string;             // internal claim ID
  encounterId?: string;
  clearinghouseRef?: string;
  payerClaimRef?: string;      // payer’s assigned reference
  createdAt: Date;
  submittedAt?: Date;
  lastUpdatedAt: Date;
  submittedBy: string;
}

export interface PayerResponse {
  status?: ClaimStatus;
  reasonCode?: string;         // e.g., CARC/RARC codes
  reasonDescription?: string;
  responseDate?: Date;
  notes?: string;
  remittanceAdviceId?: string; // EOB/ERA ref
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
}

export interface ComplianceFlags {
  hipaaOk: boolean;
  priorAuthRequired?: boolean;
  priorAuthNumber?: string;
  referralRequired?: boolean;
  referralNumber?: string;
}

export interface Claim {
  metadata: SubmissionMetadata;
  patient: PatientInfo;
  provider: ProviderInfo;
  insurance: InsuranceInfo;
  status: ClaimStatus;
  dateOfService: Date;
  diagnoses: Diagnosis[];
  serviceLines: ServiceLine[];
  financials: Financials;
  payerResponse?: PayerResponse;
  attachments?: Attachment[];
  auditTrail?: AuditEvent[];
  compliance?: ComplianceFlags;
}
