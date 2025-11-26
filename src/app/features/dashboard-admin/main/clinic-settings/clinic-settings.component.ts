import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

interface PayerConfig { name: string; id: string; claims30d: number; status: 'Active' | 'Pending' | 'Disabled'; }

@Component({
  selector: 'app-clinic-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './clinic-settings.component.html',
  styleUrls: ['./clinic-settings.component.css'],
})

export class ClinicSettingsComponent {
  npi = '1234567890';
  saving = false;

  payerConfigs: PayerConfig[] = [
    { name: 'BlueShield', id: 'BS-9921', claims30d: 214, status: 'Active' },
    { name: 'United Health', id: 'UH-3302', claims30d: 178, status: 'Active' },
    { name: 'Aetna', id: 'AE-4522', claims30d: 64, status: 'Pending' },
    { name: 'Cigna', id: 'CI-1844', claims30d: 0, status: 'Disabled' },
  ];

  saveNpi(): void {
    this.saving = true;
    setTimeout(() => { this.saving = false; console.log('NPI saved (dummy)'); }, 900);
  }
}
