import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClinicSettingsService } from './clinic-settings.service';

@Component({
  selector: 'app-clinic-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './clinic-settings.component.html',
  styleUrls: ['./clinic-settings.component.css'],
})
export class ClinicSettingsComponent implements OnInit {
  clinicId = '';

  // Clinic Name
  clinicName = '';
  savingName = false;
  nameSaveSuccess = false;

  // NPI
  npi = '';
  saving = false;
  saveSuccess = false;
  lastUpdated = new Date();

  constructor(private settingsService: ClinicSettingsService) { }

  ngOnInit(): void {
    this.clinicId = localStorage.getItem('clinicId') || '';

    if (this.clinicId) {
      // Load NPI + lastUpdated
      this.settingsService.getSettings(this.clinicId).subscribe((settings) => {
        this.npi = settings.npi || '';
        this.lastUpdated = new Date(settings.lastUpdated);
      });

      // Load clinic name
      this.settingsService.getClinicName(this.clinicId).subscribe((name) => {
        this.clinicName = name || '';
      });
    }
  }

  // Validation for NPI
  get npiInvalid(): boolean {
    return !/^\d{10}$/.test(this.npi);
  }

  // Save NPI
  saveNpi(): void {
    if (this.npiInvalid) return;

    this.saving = true;
    this.saveSuccess = false;

    this.settingsService.updateNpi(this.clinicId, this.npi).subscribe({
      next: () => {
        this.saving = false;
        this.lastUpdated = new Date();
        this.saveSuccess = true;
      },
      error: () => {
        this.saving = false;
        alert('Failed to save NPI');
      },
    });
  }

  // Save Clinic Name
  saveClinicName(): void {
    if (!this.clinicName.trim()) return;

    this.savingName = true;
    this.nameSaveSuccess = false;

    this.settingsService.updateClinicName(this.clinicId, this.clinicName).subscribe({
      next: () => {
        this.savingName = false;
        this.nameSaveSuccess = true;
      },
      error: () => {
        this.savingName = false;
        alert('Failed to update clinic name');
      },
    });
  }
}
