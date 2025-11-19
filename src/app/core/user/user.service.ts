import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  name: string;
  email: string;
  phone?: string;
  department?: 'claims' | 'support' | 'admin';
  role: 'Employee' | 'Manager' | 'Admin';
  photoUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User>({
    name: 'Kevin',
    email: 'kevin@example.com',
    role: 'Employee',
    department: 'claims',
    phone: '',
    photoUrl: null
  });

  user$ = this.userSubject.asObservable();

  updateUser(data: Partial<User>) {
    const current = this.userSubject.value;
    this.userSubject.next({ ...current, ...data });
  }

  get currentUser(): User {
    return this.userSubject.value;
  }
}