import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

type FeatureStatus = 'included' | 'planned';

interface FeatureItem {
  name: string;
  description: string;
  status: FeatureStatus;
}

interface RoadmapItem {
  quarter: string;
  label: string;
  description: string;
  stage: 'Beta' | 'Rollout' | 'Pilot' | 'Suite';
}

@Component({
  selector: 'app-plan-features',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './plan-features.component.html',
  styleUrls: ['./plan-features.component.css'],
})
export class PlanFeaturesComponent {
  currentTierName = 'MVP';
  currentTierPrice = '$500/mo';
  currentTierTag = 'Live';

  features: FeatureItem[] = [
    {
      name: 'Billing Codes',
      description: 'AI-assisted ICD-10/CPT suggestions from visit notes.',
      status: 'included',
    },
    {
      name: 'Claims Submission',
      description: 'Auto-fill & validate claim forms before submission.',
      status: 'included',
    },
    {
      name: 'Pre-Authorization',
      description: 'Predict and auto-complete pre-auth packets.',
      status: 'planned',
    },
    {
      name: 'Denial Tracking',
      description: 'Flag denials and suggest fixes for resubmission.',
      status: 'planned',
    },
    {
      name: 'Patient Intake Automation',
      description: 'Digital intake forms tied directly to billing workflow.',
      status: 'planned',
    },
    {
      name: 'Analytics & Reporting',
      description: 'Approval rates, time-to-payment, and staff efficiency.',
      status: 'planned',
    },
  ];

  roadmap: RoadmapItem[] = [
    {
      quarter: 'Q1',
      label: 'Pre-Authorization',
      description: 'Launch controlled beta of pre-auth predictions and packets.',
      stage: 'Beta',
    },
    {
      quarter: 'Q2',
      label: 'Denial Tracking',
      description: 'Roll out denial visibility and suggested corrections.',
      stage: 'Rollout',
    },
    {
      quarter: 'Q3',
      label: 'Intake Automation',
      description: 'Pilot digital intake tied directly to claims.',
      stage: 'Pilot',
    },
    {
      quarter: 'Q4',
      label: 'Analytics Suite',
      description: 'Deploy dashboards for claim performance and efficiency.',
      stage: 'Suite',
    },
  ];

  upgrade(): void {
    // Placeholder: wire to dialog / route when you’re ready
    console.log('Upgrade flow triggered');
  }
}
