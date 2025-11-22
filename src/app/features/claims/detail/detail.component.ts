// src/app/features/claims/detail/detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Claim } from '../../../core/models/claim.model';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  claim!: Claim;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    // Replace with service call; mock for MVP
    this.claim = {
      metadata: {
        claimId: id,
        createdAt: new Date('2025-11-10T09:20:00'),
        submittedAt: new Date('2025-11-11T10:00:00'),
        lastUpdatedAt: new Date(),
        submittedBy: 'j.smith',
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
      },
      insurance: {
        payerName: 'BlueCross',
        policyNumber: 'POL-123',
        groupNumber: 'GRP-777',
        subscriberName: 'John Doe',
        relationshipToSubscriber: 'Self',
      },
      status: 'Submitted',
      dateOfService: new Date('2025-11-10'),
      diagnoses: [{ code: 'J06.9', description: 'URI', primary: true }],
      serviceLines: [{ cptCode: '99213', units: 1, chargeAmount: 150, diagnosisPointers: ['A'], placeOfService: '11' }],
      financials: { totalCharge: 150, balance: 150 },
      attachments: [],
      auditTrail: [
        { at: new Date('2025-11-10T09:20:00'), by: 'j.smith', action: 'Created' },
        { at: new Date('2025-11-11T10:00:00'), by: 'j.smith', action: 'Submitted' },
      ],
      compliance: { hipaaOk: true },
    };
  }
}
