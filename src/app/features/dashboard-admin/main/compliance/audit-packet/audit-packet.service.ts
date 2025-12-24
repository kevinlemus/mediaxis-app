import { Injectable } from '@angular/core';
import html2pdf from 'html2pdf.js';

@Injectable({
    providedIn: 'root',
})
export class AuditPacketService {

    generatePdf(element: HTMLElement) {
        const options = {
            margin: 10,
            filename: 'mediAxis-audit-packet.pdf',
            image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: 'mm' as 'mm',
                format: 'a4' as 'a4',
                orientation: 'portrait' as 'portrait'
            }
        };

        return html2pdf().from(element).set(options).save();
    }
}
