import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface MetricCard {
  title: string;
  value: string | number;
  subtext: string;
  icon: string;
  accent?: boolean;
}

interface TrendItem {
  label: string;
  value: string;
}

interface ActivityItem {
  when: string;
  action: string;
  by: string;
  result: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class AdminDashboardComponent {
  // KPI metrics (example data)
  kpiCards: MetricCard[] = [
    { title: 'Claims Submitted', value: 842, subtext: 'Past 30 days', icon: 'description' },
    { title: 'Claims Approved', value: 778, subtext: 'Past 30 days', icon: 'check_circle' },
    { title: 'Claims Rejected', value: 64, subtext: 'Past 30 days', icon: 'error', accent: true },
    { title: 'Approval Rate', value: '92.4%', subtext: 'Rolling', icon: 'percent' },
    { title: 'Revenue Impact', value: '$148K', subtext: 'Estimated reimbursements', icon: 'payments' },
    { title: 'Time Saved', value: '286 hrs', subtext: 'Automation vs manual', icon: 'schedule' },
  ];

  // ROI highlights (example data)
  roiHighlights: TrendItem[] = [
    { label: 'Avg prep time (before)', value: '30m' },
    { label: 'Avg prep time (now)', value: '3m' },
    { label: 'Denials prevented', value: '41' },
    { label: 'Recovered value', value: '$22.7K' },
  ];

  // Recent activity (example data)
  recentActivity: ActivityItem[] = [
    { when: '2m ago', action: 'Claim resubmitted', by: 'J. Patel', result: 'Queued' },
    { when: '14m ago', action: 'Bulk upload processed', by: 'System', result: 'Parsed' },
    { when: '1h ago', action: 'User invited', by: 'A. Rivera', result: 'Pending acceptance' },
    { when: '3h ago', action: 'Payer config updated', by: 'M. Chen', result: 'Approved' },
    { when: '6h ago', action: 'Claim denied', by: 'System', result: 'Rejected' },
  ];

  openReport(): void {
    console.log('Open ROI report (dummy).');
  }

  // ✅ Logic to assign chip classes consistently
  statusClass(result: string): string {
    const normalized = result.toLowerCase();
    if (normalized.includes('queued')) return 'queued';
    if (normalized.includes('parsed')) return 'parsed';
    if (normalized.includes('pending')) return 'pending';
    if (normalized.includes('approved')) return 'approved';
    if (normalized.includes('rejected') || normalized.includes('denied')) return 'rejected';
    return 'default';
  }
}
