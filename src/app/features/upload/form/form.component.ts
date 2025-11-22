import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Types from your Claim model
import {
  Claim,
  ClaimStatus,
  ClaimType,
  PatientInfo,
  ProviderInfo,
  InsuranceInfo,
  ServiceLine,
  Diagnosis,
  Financials,
  SubmissionMetadata,
} from '../../../core/models/claim.model';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class UploadFormComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploadedFile: File | null = null;
  isProcessing = false;

  claimForm: Claim = {
    metadata: {
      claimId: '',
      claimType: 'Professional',
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
      submittedBy: 'System',
    } as SubmissionMetadata,
    patient: {
      mrn: '',
      firstName: '',
      lastName: '',
      dob: new Date(),
    } as PatientInfo,
    provider: { renderingProviderName: '', renderingNPI: '' } as ProviderInfo,
    insurance: { payerName: '', policyNumber: '' } as InsuranceInfo,
    status: 'Draft' as ClaimStatus,
    dateOfService: new Date(),
    diagnoses: [] as Diagnosis[],
    serviceLines: [] as ServiceLine[],
    financials: { totalCharge: 0 } as Financials,
  };

  triggerFileDialog(): void {
    this.fileInput?.nativeElement.click();
  }

  onUploadBoxKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.triggerFileDialog();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      this.uploadedFile = file;
      this.processFile();
    }
  }

  processFile(): void {
    this.isProcessing = true;
    // Simulate AI processing
    setTimeout(() => {
      this.claimForm = {
        metadata: {
          claimId: 'CLM-1001',
          claimType: 'Professional',
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
          submittedBy: 'AI Engine',
        },
        patient: {
          mrn: 'MRN12345',
          firstName: 'John',
          lastName: 'Doe',
          dob: new Date('1980-05-12'),
          gender: 'Male',
          phone: '555-1234',
          email: 'john.doe@example.com',
          addressLine1: '123 Main St',
          city: 'Indianapolis',
          state: 'IN',
          zip: '46201',
        },
        provider: {
          renderingProviderName: 'Dr. Jane Smith',
          renderingNPI: '1234567890',
          billingProviderName: 'Clinic Billing',
          billingNPI: '9876543210',
          taxonomyCode: '207Q00000X',
          specialtyCode: 'Family',
          facilityName: 'MediAxis Clinic',
        },
        insurance: {
          payerName: 'BlueCross',
          policyNumber: 'BC-1234567',
          groupNumber: 'GRP-890',
          subscriberName: 'John Doe',
          relationshipToSubscriber: 'Self',
        },
        status: 'Draft',
        dateOfService: new Date('2025-11-01'),
        diagnoses: [
          {
            code: 'J06.9',
            description: 'Acute upper respiratory infection',
            primary: true,
          },
        ],
        serviceLines: [
          {
            cptCode: '99213',
            units: 1,
            chargeAmount: 150,
            diagnosisPointers: ['J06.9'],
          },
        ],
        financials: {
          totalCharge: 150,
          allowedAmount: 120,
          paidAmount: 100,
          patientResponsibility: 20,
          balance: 30,
        },
      };
      this.isProcessing = false;
    }, 1500);
  }

  submitClaim(): void {
    alert('Claim submitted successfully!');
    // TODO: integrate with backend service
  }

  resetForm(): void {
    this.uploadedFile = null;
    this.claimForm = {
      metadata: {
        claimId: '',
        claimType: 'Professional',
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
        submittedBy: 'System',
      },
      patient: { mrn: '', firstName: '', lastName: '', dob: new Date() },
      provider: { renderingProviderName: '', renderingNPI: '' },
      insurance: { payerName: '', policyNumber: '' },
      status: 'Draft',
      dateOfService: new Date(),
      diagnoses: [],
      serviceLines: [],
      financials: { totalCharge: 0 },
    };
  }
}
