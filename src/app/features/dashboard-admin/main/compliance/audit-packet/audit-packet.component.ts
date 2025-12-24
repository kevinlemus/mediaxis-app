import { Component } from '@angular/core';

@Component({
    selector: 'app-audit-packet',
    standalone: true,
    templateUrl: './audit-packet.template.html',
    styleUrls: ['./audit-packet.styles.css'],
})
export class AuditPacketComponent {
    generatedDate = new Date().toLocaleDateString();
}
