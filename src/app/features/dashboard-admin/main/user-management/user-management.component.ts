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
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Revoked' | 'Invited';
  lastLogin: string;
}

type PendingActionType = 'ACTIVE' | 'SUSPENDED' | 'REVOKED';

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
    { value: 'staff', label: 'Staff' },
    { value: 'billing-manager', label: 'Billing Manager' },
    { value: 'auditor', label: 'Auditor' },
  ];

  users: UserRow[] = [];

  searchTerm = '';
  sortKey: keyof UserRow = 'name';
  sortDirection: 'asc' | 'desc' | 'activeFirst' | 'invitedFirst' | 'suspendedFirst' = 'asc';

  private statusOrder: Record<string, number> = {
    active: 1,
    invited: 2,
    suspended: 3,
    revoked: 4
  };

  /**
   * Tracks which user/action is pending confirmation for status changes.
   * When non-null, a confirmation modal is shown.
   */
  pendingAction: { user: UserRow; action: PendingActionType } | null = null;

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
    if (!clinicId) return;

    this.http
      .get<any[]>(`${environment.apiUrl}/profile/clinic/${clinicId}`)
      .subscribe({
        next: (profiles) => {
          this.users = profiles.map((p) => ({
            id: p.userId, // backend returns userId, not id
            name: p.name ?? '',
            email: p.email,
            role: p.role,
            status: this.mapBackendStatus(p.status),
            lastLogin: p.lastLogin ? this.formatLastLogin(p.lastLogin) : '—',
          }));
        }
      });
  }

  /**
   * Maps backend status (ACTIVE, SUSPENDED, REVOKED) to UI labels.
   */
  private mapBackendStatus(status: string): UserRow['status'] {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'SUSPENDED': return 'Suspended';
      case 'REVOKED': return 'Revoked';
      default: return 'Invited';
    }
  }

  private formatLastLogin(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '—';

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
        return dir === 'asc'
          ? rank(valA) - rank(valB)
          : rank(valB) - rank(valA);
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
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }

  submitInvite(): void {
    if (!this.inviteForm.name.trim() || !this.inviteForm.email.trim()) return;

    this.inviting = true;
    this.inviteSuccess = false;
    this.inviteError = null;

    this.authService.sendInvite(this.inviteForm.email, this.inviteForm.role).subscribe({
      next: () => {
        this.loadUsers();
        this.inviteForm = { name: '', email: '', role: 'staff' };
        this.inviting = false;
        this.inviteSuccess = true;
        setTimeout(() => (this.inviteSuccess = false), 4000);
      },
      error: () => {
        this.inviting = false;
        this.inviteError = 'Failed to send invite. Please try again.';
        setTimeout(() => (this.inviteError = null), 4000);
      },
    });
  }

  roleBadge(role: string): string {
    switch (role) {
      case 'admin': return 'Admin';
      case 'billing-manager': return 'Billing Manager';
      case 'auditor': return 'Auditor';
      default: return 'Staff';
    }
  }

  /**
   * Status change entry points — now open a confirmation modal instead
   * of immediately calling the backend.
   */
  activate(u: UserRow): void {
    this.pendingAction = { user: u, action: 'ACTIVE' };
  }

  suspend(u: UserRow): void {
    this.pendingAction = { user: u, action: 'SUSPENDED' };
  }

  revoke(u: UserRow): void {
    this.pendingAction = { user: u, action: 'REVOKED' };
  }

  /** Closes the confirmation modal without persisting changes. */
  cancelAction(): void {
    this.pendingAction = null;
  }

  /** Confirms the selected action and persists the status change to the backend. */
  confirmAction(): void {
    if (!this.pendingAction) return;

    const { user, action } = this.pendingAction;

    this.http.patch(`${environment.apiUrl}/users/${user.id}/status`, { status: action })
      .subscribe({
        next: () => {
          this.pendingAction = null;
          this.loadUsers();
        },
        error: () => alert('Failed to update status.')
      });
  }
}
