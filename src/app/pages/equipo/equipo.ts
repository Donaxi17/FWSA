import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})
export class EquipoComponent {
  private router = inject(Router);
  activeMemberId: number | null = null;

  navigateToUnete() {
    this.router.navigate(['/unete']);
  }

  toggleFlip(id: number, event: Event) {
    event.stopPropagation();
    if (this.activeMemberId === id) {
      this.activeMemberId = null;
    } else {
      this.activeMemberId = id;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.activeMemberId = null;
  }
}
