import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

type SortDirection = 'asc' | 'desc' | 'approvedFirst';

@Component({
  selector: 'app-claims-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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
    },
    {
      id: '12347',
      patientName: 'Robert Brown',
      dateOfService: new Date('2025-11-15'),
      status: 'Rejected',
      cptCode: '99215',
      icdCode: 'I10',
      insuranceProvider: 'Aetna',
      claimAmount: 300.00,
      submittedBy: 'm.wilson',
      expanded: false
    }
  ];

  searchTerm: string = '';
  sortField: string = 'dateOfService';
  sortDirection: SortDirection = 'asc';

  private statusOrder: Record<string, number> = {
    submitted: 1,
    approved: 2,
    rejected: 3
  };

  get filteredClaims() {
    const q = this.searchTerm.trim().toLowerCase();
    const filtered = this.claims.filter(c =>
      c.patientName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q) ||
      c.insuranceProvider.toLowerCase().includes(q)
    );
    return this.sortClaims(filtered);
  }

  toggleExpand(claim: any) {
    claim.expanded = !claim.expanded;
  }

  sortClaims(list: any[]) {
    const field = this.sortField;
    const direction = this.sortDirection;

    const comparator = (a: any, b: any) => {
      let valA = a[field];
      let valB = b[field];

      if (field === 'status') {
        const rank = (s: string) => this.statusOrder[s?.toLowerCase()] ?? 99;
        if (direction === 'approvedFirst') {
          const isApprovedA = (valA as string)?.toLowerCase() === 'approved' ? 0 : 1;
          const isApprovedB = (valB as string)?.toLowerCase() === 'approved' ? 0 : 1;
          if (isApprovedA !== isApprovedB) return isApprovedA - isApprovedB;
          return rank(valA as string) - rank(valB as string);
        }
        return direction === 'asc'
          ? rank(valA as string) - rank(valB as string)
          : rank(valB as string) - rank(valA as string);
      }

      if (valA instanceof Date && valB instanceof Date) {
        valA = valA.getTime();
        valB = valB.getTime();
      }
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return (b.dateOfService as Date).getTime() - (a.dateOfService as Date).getTime()
        || (a.id as string).localeCompare(b.id as string);
    };

    return [...list].sort(comparator);
  }

  setSort(field: string) {
    if (this.sortField === field) {
      if (field === 'status') {
        this.sortDirection =
          this.sortDirection === 'asc' ? 'desc' :
          this.sortDirection === 'desc' ? 'approvedFirst' :
          'asc';
      } else {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      }
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }
}
