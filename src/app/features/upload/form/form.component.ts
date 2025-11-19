import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class UploadFormComponent {
  uploadedFile: File | null = null;
  isProcessing = false;

  // Example auto-filled claim form fields
  claimForm = {
    patientName: '',
    patientDOB: '',
    insuranceProvider: '',
    billingCode: '',
    diagnosisCode: '',
    claimAmount: ''
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
      this.processFile();
    }
  }

  processFile() {
    this.isProcessing = true;
    // Simulate AI processing
    setTimeout(() => {
      this.claimForm = {
        patientName: 'John Doe',
        patientDOB: '1980-05-12',
        insuranceProvider: 'BlueCross',
        billingCode: '99213',
        diagnosisCode: 'J06.9',
        claimAmount: '150.00'
      };
      this.isProcessing = false;
    }, 2000);
  }

  submitClaim() {
    alert('Claim submitted successfully!');
    // TODO: integrate with backend service
  }

  resetForm() {
    this.uploadedFile = null;
    this.claimForm = {
      patientName: '',
      patientDOB: '',
      insuranceProvider: '',
      billingCode: '',
      diagnosisCode: '',
      claimAmount: ''
    };
  }
}
