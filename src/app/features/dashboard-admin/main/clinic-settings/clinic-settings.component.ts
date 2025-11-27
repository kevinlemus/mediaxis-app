import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface PayerConfig {
  name: string;
  id: string;
  claims30d: number;
  status: 'Active' | 'Pending' | 'Disabled';
}

@Component({
  selector: 'app-clinic-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './clinic-settings.component.html',
  styleUrls: ['./clinic-settings.component.css'],
})
export class ClinicSettingsComponent {
  npi = '1234567890';
  saving = false;
  saveSuccess = false;
  lastUpdated = new Date();

  displayedColumns: string[] = ['name', 'id', 'claims', 'status'];

  // Search state
  payerSearch = signal('');

  // Payers list
  payers = signal<PayerConfig[]>([
    { name: 'BlueShield', id: 'BS-9921', claims30d: 214, status: 'Active' },
    { name: 'United Health', id: 'UH-3302', claims30d: 178, status: 'Active' },
    { name: 'Aetna', id: 'AE-4522', claims30d: 64, status: 'Pending' },
    { name: 'Cigna', id: 'CI-1844', claims30d: 0, status: 'Disabled' },
  ]);

  filteredPayers = computed(() => {
    const q = this.payerSearch().trim().toLowerCase();
    if (!q) return this.payers();
    return this.payers().filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  });

  get npiInvalid(): boolean {
    return !/^\d{10}$/.test(this.npi);
  }

  saveNpi(): void {
    if (this.npiInvalid) return;
    this.saving = true;
    this.saveSuccess = false;
    setTimeout(() => {
      this.saving = false;
      this.lastUpdated = new Date();
      this.saveSuccess = true;
    }, 900);
  }

  // Add payer form state
  newPayerName = '';
  newPayerId = '';
  showAddForm = false;

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.newPayerName = '';
    this.newPayerId = '';
  }

  addPayer(): void {
    if (!this.newPayerName || !this.newPayerId) return;
    const demo: PayerConfig = {
      name: this.newPayerName,
      id: this.newPayerId,
      claims30d: 0,
      status: 'Pending',
    };
    this.payers.update((list) => [demo, ...list]);
    this.toggleAddForm();
  }
}
