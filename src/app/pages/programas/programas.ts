import { Component, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { runInZone } from '../../services/transparency.service';
import { CommonModule } from '@angular/common';
import { ProgramsService, Program } from '../../services/programs.service';

@Component({
    selector: 'app-programas',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './programas.html',
    styleUrls: ['./programas.css']
})
export class ProgramasComponent {
    private programsService = inject(ProgramsService);
    private cdr = inject(ChangeDetectorRef);
    private ngZone = inject(NgZone);
    programas: Program[] = [];
    showDocsModal = false;

    // Filtering states
    selectedCategory: string = 'Todos';
    selectedStatus: string = 'Todos';
    tempCategory: string = 'Todos';
    tempStatus: string = 'Todos';
    showFilterMenu = false;

    documentos = [
        { id: 1, title: 'Certificado de Existencia y Representación', type: 'PDF', size: '1.2 MB', icon: 'fas fa-file-contract', color: 'bg-blue-500', url: '#' },
        { id: 2, title: 'RUT Actualizado 2024', type: 'PDF', size: '450 KB', icon: 'fas fa-id-card', color: 'bg-orange-500', url: '#' },
        { id: 3, title: 'Estados Financieros 2023', type: 'PDF', size: '2.8 MB', icon: 'fas fa-chart-pie', color: 'bg-green-500', url: '#' },
        { id: 4, title: 'Certificado de Antecedentes (Cámara de Comercio)', type: 'PDF', size: '890 KB', icon: 'fas fa-shield-alt', color: 'bg-indigo-500', url: '#' },
        { id: 5, title: 'Estatutos de la Fundación', type: 'PDF', size: '5.4 MB', icon: 'fas fa-gavel', color: 'bg-pink-500', url: '#' }
    ];

    constructor() {
        this.programsService.getPrograms().pipe(runInZone(this.ngZone)).subscribe(data => {
            this.programas = data;
            this.refresh();
        });
    }

    get filteredProgramas() {
        return this.programas.filter(p => {
            const matchCat = this.selectedCategory === 'Todos' || p.category === this.selectedCategory;
            const matchStatus = this.selectedStatus === 'Todos' || p.status === this.selectedStatus;
            return matchCat && matchStatus;
        });
    }

    get categories() {
        const cats = this.programas.map(p => p.category);
        return ['Todos', ...new Set(cats)];
    }

    get statuses() {
        return ['Todos', 'Activo', 'Finalizado'];
    }

    toggleFilterMenu() {
        if (!this.showFilterMenu) {
            // Opening: sync temps
            this.tempCategory = this.selectedCategory;
            this.tempStatus = this.selectedStatus;
        }
        this.showFilterMenu = !this.showFilterMenu;
    }

    applyFilters() {
        this.selectedCategory = this.tempCategory;
        this.selectedStatus = this.tempStatus;
        this.showFilterMenu = false;
        this.refresh();
    }

    setCategory(cat: string) {
        this.tempCategory = cat;
        this.refresh();
    }

    setStatus(status: string) {
        this.tempStatus = status;
        this.refresh();
    }

    toggleDocsModal() {
        this.showDocsModal = !this.showDocsModal;
    }

    /**
     * Redibuja dentro de la zona de Angular. Si se redibuja fuera (p. ej. tras una
     * respuesta de Firebase), los botones creados quedan sin reaccionar a los clics.
     */
    private refresh() {
        this.ngZone.run(() => this.cdr.detectChanges());
    }
}
