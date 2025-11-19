import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-claims-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ClaimsListComponent {
  claims = [
    {
      id: '12345',
      patientName: 'John Doe',
      dateOfService: new Date('2025-11-10'),
      status: 'Submitted',
      cptCode: '99213',
      icdCode: 'J06.9',
      insuranceProvider: 'BlueCross',
      claimAmount: 150.00,
      submittedBy: 'j.smith',
      expanded: false
    },
    {
      id: '12346',
      patientName: 'Jane Smith',
      dateOfService: new Date('2025-11-12'),
      status: 'Approved',
      cptCode: '99214',
      icdCode: 'M54.5',
      insuranceProvider: 'UnitedHealth',
      claimAmount: 200.00,
      submittedBy: 'a.jones',
      expanded: false
    }
  ];

  toggleExpand(claim: any) {
    claim.expanded = !claim.expanded;
  }
}
