import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface ClinicSettings {
    npi: string;
    lastUpdated: string;
}

@Injectable({ providedIn: 'root' })
export class ClinicSettingsService {
    private baseUrl = `${environment.apiUrl}/clinic`;

    constructor(private http: HttpClient) { }

    /**
     * Fetches the clinic's settings row.
     * Currently includes:
     * - NPI
     * - lastUpdated timestamp
     */
    getSettings(clinicId: string): Observable<ClinicSettings> {
        return this.http.get<ClinicSettings>(`${this.baseUrl}/${clinicId}/settings`);
    }

    /**
     * Updates the clinic's NPI.
     * This calls the dedicated NPI endpoint.
     */
    updateNpi(clinicId: string, npi: string): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${clinicId}/settings/npi`, { npi });
    }

    /**
     * Fetches the clinic's display name.
     * This is identity data, not settings data,
     * but the controller exposes it under /clinic/{id}/name.
     */
    getClinicName(clinicId: string): Observable<string> {
        return this.http.get(`${this.baseUrl}/${clinicId}/name`, { responseType: 'text' });
    }

    /**
     * Updates core clinic identity fields (PATCH semantics).
     * Currently supports:
     * - name
     *
     * Future:
     * - timezone
     * - address
     * - phone
     * - branding
     */
    updateClinicName(clinicId: string, name: string): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/${clinicId}`, { name });
    }
}
