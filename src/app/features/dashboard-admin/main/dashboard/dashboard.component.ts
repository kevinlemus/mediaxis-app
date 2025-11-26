import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface MetricCard { title: string; value: string | number; subtext: string; icon: string; accent?: boolean; }
interface TrendItem { label: string; value: string; }

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})

export class AdminDashboardComponent {
  // KPI metrics (dummy data)
  kpiCards: MetricCard[] = [
    { title: 'Claims Submitted', value: 842, subtext: 'Past 30 days', icon: 'description' },
    { title: 'Claims Approved', value: 778, subtext: 'Past 30 days', icon: 'check_circle' },
    { title: 'Claims Rejected', value: 64, subtext: 'Past 30 days', icon: 'error', accent: true },
    { title: 'Approval Rate', value: '92.4%', subtext: 'Rolling', icon: 'percent' },
    { title: 'Revenue Impact', value: '$148K', subtext: 'Estimated reimbursements', icon: 'payments' },
    { title: 'Time Saved', value: '286 hrs', subtext: 'Automation vs manual', icon: 'schedule' },
  ];

  roiHighlights: TrendItem[] = [
    { label: 'Avg prep time (before)', value: '30m' },
    { label: 'Avg prep time (now)', value: '3m' },
    { label: 'Denials prevented', value: '41' },
    { label: 'Recovered value', value: '$22.7K' },
  ];

  recentActivity = [
    { when: '2m ago', action: 'Claim resubmitted', by: 'J. Patel', result: 'Queued' },
    { when: '14m ago', action: 'Bulk upload processed', by: 'System', result: '842 parsed' },
    { when: '1h ago', action: 'User invited', by: 'A. Rivera', result: 'Pending acceptance' },
    { when: '3h ago', action: 'Payer config updated', by: 'M. Chen', result: 'New CPT set' },
  ];

  openReport(): void {
    // Placeholder for opening a detailed ROI/export report
    console.log('Open ROI report (dummy).');
  }
}
