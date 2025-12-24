import { Component } from '@angular/core';
import { AuditPacketComponent } from '../audit-packet/audit-packet.component';

@Component({
    selector: 'app-audit-packet-preview',
    standalone: true,
    imports: [AuditPacketComponent],
    templateUrl: './audit-packet-preview.component.html',
    styleUrls: ['./audit-packet-preview.component.css'],
})
export class AuditPacketPreviewComponent { }
