import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuditPacketService {
    constructor() { }

    // Future: HTML → PDF export logic
    generatePdf() {
        console.log('PDF generation will be implemented here.');
    }
}
