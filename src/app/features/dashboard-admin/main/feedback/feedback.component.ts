import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface FeedbackItem { date: string; reporter: string; category: string; severity: 'Low' | 'Medium' | 'High'; status: 'Open' | 'Triaged' | 'Closed'; }

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})

export class FeedbackComponent {
  items: FeedbackItem[] = [
    { date: '2025-11-26', reporter: 'J. Patel', category: 'Claims', severity: 'High', status: 'Open' },
    { date: '2025-11-26', reporter: 'M. Chen', category: 'UX', severity: 'Medium', status: 'Triaged' },
    { date: '2025-11-25', reporter: 'A. Rivera', category: 'Performance', severity: 'Low', status: 'Closed' },
  ];
  filterCategory = '';
  note = '';
  
  // Derived counts used in template to avoid arrow functions in binding
  get openCount(): number { return this.items.filter(i => i.status === 'Open').length; }
  get triagedCount(): number { return this.items.filter(i => i.status === 'Triaged').length; }
  get closedCount(): number { return this.items.filter(i => i.status === 'Closed').length; }

  filtered(): FeedbackItem[] {
    return this.items.filter(i => !this.filterCategory || i.category === this.filterCategory);
  }

  addNote(): void {
    console.log('Add internal note (dummy):', this.note);
    this.note = '';
  }
}
