import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface FeatureItem { name: string; active: boolean; description: string; }

@Component({
  selector: 'app-plan-features',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './plan-features.component.html',
  styleUrls: ['./plan-features.component.css'],
})

export class PlanFeaturesComponent {
  currentTier = 'MVP ($500/mo)';
  features: FeatureItem[] = [
    { name: 'Billing Codes', active: true, description: 'AI-assisted ICD-10/CPT suggestions.' },
    { name: 'Claims Submission', active: true, description: 'Auto-fill & validate claim forms.' },
    { name: 'Pre-Authorization', active: false, description: 'Predict & auto-complete pre-auth packets.' },
    { name: 'Denial Tracking', active: false, description: 'Flag & suggest fixes for denials.' },
    { name: 'Patient Intake Automation', active: false, description: 'Digital forms tied to billing workflow.' },
  ];

  upgrade(): void { console.log('Upgrade flow (dummy)'); }
}
