import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 add RouterModule here
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  claim: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // Mock data for now; later fetch from a service
    this.claim = {
      id,
      patientName: 'John Doe',
      dateOfService: new Date('2025-11-10'),
      status: 'Submitted',
      cptCode: '99213',
      icdCode: 'J06.9',
      insuranceProvider: 'BlueCross',
      claimAmount: 150.0,
      submittedBy: 'j.smith',
    };
  }
}
