import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})
export class EquipoComponent {
  activeMemberId: number | null = null;

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
