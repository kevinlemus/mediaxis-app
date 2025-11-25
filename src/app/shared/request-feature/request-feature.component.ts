import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-feature',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './request-feature.component.html',
  styleUrls: ['./request-feature.component.css'],
})
export class RequestFeatureComponent {
  title = '';
  description = '';
  successMessage = '';

  constructor(private router: Router) {}

  submitRequest() {
    this.successMessage = '';

    if (!this.title.trim() || !this.description.trim()) {
      return;
    }

    console.log('Feature request submitted:', {
      title: this.title,
      description: this.description,
    });

    this.successMessage = 'Your feature request has been sent. Thank you!';
    this.title = '';
    this.description = '';

    setTimeout(() => (this.successMessage = ''), 4000);
  }

  cancel() {
    this.router.navigate(['/dashboard-employee/settings']);
  }
}
