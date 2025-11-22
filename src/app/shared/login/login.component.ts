import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  resetSuccess = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Check query params for reset success
    this.route.queryParams.subscribe(params => {
      if (params['reset'] === 'success') {
        this.resetSuccess = true;
      }
    });
  }

  login() {
    console.log('Login attempt:', { email: this.email, password: this.password });
    alert('Login submitted');
  }
}
