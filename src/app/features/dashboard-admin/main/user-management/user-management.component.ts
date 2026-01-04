import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '../../../../core/auth/auth.service';

interface UserRow {
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastLogin: string;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  inviteForm = { name: '', email: '', role: 'staff' };
  inviting = false;
  inviteSuccess = false;
  inviteError: string | null = null;

  roles = [
    { value: 'staff', 'label': 'Staff' },
    { value: 'billing-manager', 'label': 'Billing Manager' },
    { value: 'auditor', 'label': 'Auditor' },
  ];

  users: UserRow[] = [];

  searchTerm = '';
  sortKey: keyof UserRow = 'name';
  sortDirection: 'asc' | 'desc' | 'activeFirst' | 'invitedFirst' | 'suspendedFirst' = 'asc';
  private statusOrder: Record<string, number> = {
    active: 1,
    invited: 2,
    suspended: 3,
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Loads all users for the current clinic from the backend.
   * Uses the /profile/clinic/{clinicId} endpoint.
   */
  private loadUsers(): void {
    const clinicId = this.authService.getClinicId();
    if (!clinicId) {
      // In a real app, you might redirect or show an error state here.
      return;
    }

    this.http
      .get<any[]>(`${environment.apiUrl}/profile/clinic/${clinicId}`)
      .subscribe({
        next: (profiles) => {
          this.users = profiles.map((p) => ({
            name: p.name ?? '',
            email: p.email,
            role: p.role,
            status: (p.status ?? 'Active') as 'Active' | 'Invited' | 'Suspended',
            // Format ISO timestamp into a human‑readable string for the table
            lastLogin: p.lastLogin ? this.formatLastLogin(p.lastLogin) : '—',
          }));
        },
        error: () => {
          // For now, fail silently in the UI. You can add error UX later.
        },
      });
  }

  /**
   * Converts an ISO-8601 timestamp from the backend into a readable string.
   * Example:
   *   "2026-01-03T20:16:36.527421Z" -> "Jan 3, 2026, 3:16 PM"
   */
  private formatLastLogin(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  get filteredUsers(): UserRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = this.users.filter(
      (u) =>
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term) ||
        u.status.toLowerCase().includes(term)
    );

    const key = this.sortKey;
    const dir = this.sortDirection;

    const comparator = (a: UserRow, b: UserRow) => {
      let valA: any = a[key];
      let valB: any = b[key];

      if (key === 'status') {
        const rank = (s: string) => this.statusOrder[s?.toLowerCase()] ?? 99;
        const prefer = (target: string) => (value: string) => (value?.toLowerCase() === target ? 0 : 1);
        const priorityComparator = (target: string) => {
          const pA = prefer(target)(valA as string);
          const pB = prefer(target)(valB as string);
          if (pA !== pB) return pA - pB;
          return rank(valA as string) - rank(valB as string);
        };

        switch (dir) {
          case 'activeFirst':
            return priorityComparator('active');
          case 'invitedFirst':
            return priorityComparator('invited');
          case 'suspendedFirst':
            return priorityComparator('suspended');
          case 'asc':
            return rank(valA as string) - rank(valB as string);
          case 'desc':
          default:
            return rank(valB as string) - rank(valA as string);
        }
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return a.name.localeCompare(b.name) || a.email.localeCompare(b.email);
    };

    return [...filtered].sort(comparator);
  }

  setSort(key: keyof UserRow): void {
    if (this.sortKey === key) {
      if (key === 'status') {
        const cycle: Array<typeof this.sortDirection> = ['activeFirst', 'invitedFirst', 'suspendedFirst'];
        const idx = cycle.indexOf(this.sortDirection);
        this.sortDirection = cycle[(idx + 1) % cycle.length];
      } else {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      }
    } else {
      this.sortKey = key;
      this.sortDirection = key === 'status' ? 'activeFirst' : 'asc';
    }
  }

  submitInvite(): void {
    if (
      !this.inviteForm.name.trim() ||
      !this.inviteForm.email.trim() ||
      !this.inviteForm.role
    ) {
      return;
    }

    this.inviting = true;
    this.inviteSuccess = false;
    this.inviteError = null;

    this.authService.sendInvite(this.inviteForm.email, this.inviteForm.role).subscribe({
      next: () => {
        // We don't create the user locally here because the real source of truth is the backend.
        // Reload the users from the API so the new "Invited" user appears in the Accounts table.
        this.loadUsers();

        this.inviteForm = { name: '', email: '', role: 'staff' };
        this.inviting = false;
        this.inviteSuccess = true;

        // Auto-hide success banner after 4 seconds
        setTimeout(() => (this.inviteSuccess = false), 4000);
      },
      error: () => {
        this.inviting = false;
        this.inviteError = 'Failed to send invite. Please try again.';
        // Auto-hide error banner after 4 seconds
        setTimeout(() => (this.inviteError = null), 4000);
      },
    });
  }

  roleBadge(role: string): string {
    switch (role) {
      case 'billing-manager':
        return 'Billing Manager';
      case 'auditor':
        return 'Auditor';
      default:
        return 'Staff';
    }
  }

  // These still only update local state.
  // Later you can wire them to backend /users/{id}/status endpoints.
  suspend(u: UserRow): void {
    u.status = 'Suspended';
  }

  activate(u: UserRow): void {
    u.status = 'Active';
  }

  revoke(u: UserRow): void {
    u.status = 'Suspended';
  }
}
