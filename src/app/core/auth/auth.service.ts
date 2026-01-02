import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Base API URL for all auth endpoints.
   *
   * IMPORTANT:
   * environment.apiUrl should be the ROOT, e.g.:
   *   http://localhost:8080
   *
   * We append `/auth` here so all endpoints become:
   *   POST /auth/login
   *   POST /auth/reset-password
   *   POST /auth/update-password
   */
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  /**
   * Logs in the user and stores the JWT in localStorage.
   */
  login(email: string, password: string): Observable<{ token: string, clinicId: string }> {
    return this.http.post<{ token: string, clinicId: string }>(
      `${this.baseUrl}/login`,
      { email, password }
    ).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.token);
        localStorage.setItem('clinicId', response.clinicId);
      })
    );
  }

  /**
   * Logs out the user by clearing the JWT.
   */
  logout(): void {
    localStorage.removeItem('jwt');
  }

  /**
   * Retrieves the stored JWT.
   */
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  /**
   * Returns true if a JWT exists.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Extracts the user's role from the JWT.
   */
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Requests a password reset email.
   *
   * FIXED:
   * Previously: `${this.baseUrl}/auth/reset-password`
   * Which produced: /auth/auth/reset-password
   *
   * Now correct: `${this.baseUrl}/reset-password`
   * Produces: /auth/reset-password
   */
  requestPasswordReset(email: string) {
    return this.http.post(`${this.baseUrl}/reset-password`, { email });
  }

  updatePassword(token: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/update-password`, {
      token,
      newPassword
    });
  }

  registerAdmin(body: {
    clinicName: string;
    fullName: string;
    email: string;
    password: string;
  }): Observable<{ token: string, clinicId: string }> {
    return this.http.post<{ token: string, clinicId: string }>(
      `${this.baseUrl}/register`,
      body
    ).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.token);
        localStorage.setItem('clinicId', response.clinicId);
      })
    );
  }

}
