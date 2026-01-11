import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../../core/user/user.service';

@Component({
  selector: 'app-profile-drawer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './profile-drawer.component.html',
  styleUrls: ['./profile-drawer.component.css'],
})
export class ProfileDrawerComponent {
  @Output() close = new EventEmitter<void>();

  profileForm: FormGroup;
  pendingAvatar: string | null = null;
  useFallback = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    const user = this.userService.currentUser;

    this.profileForm = this.fb.group({
      name: [user.name, Validators.required],
      email: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
      phone: [user.phone ?? ''],
      department: [user.department ?? '', Validators.required],
      role: [{ value: user.role, disabled: true }],
    });
  }

  get avatarSrc(): string {
    const src =
      this.pendingAvatar ||
      this.userService.currentUser.photoUrl ||
      '';

    this.useFallback = !src;
    return src;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.pendingAvatar = reader.result as string;
        this.useFallback = false;
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    const raw = this.profileForm.getRawValue();

    this.userService.updateUser({
      name: raw.name,
      phone: raw.phone,
      department: raw.department,
      photoUrl: this.pendingAvatar ?? this.userService.currentUser.photoUrl,
    });

    this.pendingAvatar = null;
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }
}
