import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

interface UserRow { name: string; email: string; role: string; status: 'Active' | 'Invited' | 'Suspended'; lastLogin: string; }

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatMenuModule, MatTableModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})

export class UserManagementComponent {
  inviteForm = { name: '', email: '', role: 'staff' };
  inviting = false;
  roles = [
    { value: 'staff', label: 'Staff' },
    { value: 'billing-manager', label: 'Billing Manager' },
    { value: 'auditor', label: 'Auditor' },
  ];

  users: UserRow[] = [
    { name: 'Jessica Patel', email: 'j.patel@example.com', role: 'billing-manager', status: 'Active', lastLogin: '2h ago' },
    { name: 'Marco Chen', email: 'm.chen@example.com', role: 'staff', status: 'Active', lastLogin: '15m ago' },
    { name: 'Ariana Rivera', email: 'a.rivera@example.com', role: 'auditor', status: 'Invited', lastLogin: '—' },
    { name: 'Devon Lee', email: 'd.lee@example.com', role: 'staff', status: 'Suspended', lastLogin: '3d ago' },
  ];

  submitInvite(): void {
    this.inviting = true;
    setTimeout(() => {
      this.users.push({
        name: this.inviteForm.name,
        email: this.inviteForm.email,
        role: this.inviteForm.role,
        status: 'Invited',
        lastLogin: '—'
      });
      this.inviteForm = { name: '', email: '', role: 'staff' };
      this.inviting = false;
    }, 800);
  }

  roleBadge(role: string): string {
    switch (role) {
      case 'billing-manager': return 'Billing Manager';
      case 'auditor': return 'Auditor';
      default: return 'Staff';
    }
  }

  suspend(u: UserRow): void { u.status = 'Suspended'; }
  activate(u: UserRow): void { u.status = 'Active'; }
  revoke(u: UserRow): void { u.status = 'Suspended'; }
}
