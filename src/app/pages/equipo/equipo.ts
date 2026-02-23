import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TeamService, TeamMember } from '../../services/team.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})
export class EquipoComponent implements OnInit {
  private router = inject(Router);
  private teamService = inject(TeamService);

  team$: Observable<TeamMember[]> | null = null;
  activeMemberId: string | null = null;

  ngOnInit() {
    this.team$ = this.teamService.getTeam();
  }

  navigateToUnete() {
    this.router.navigate(['/unete']);
  }

  toggleFlip(id: string, event: Event) {
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
