import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VacanciesService, Vacancy } from '../../../services/vacancies.service';

@Component({
    selector: 'app-vacantes-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section id="vacantes-section" class="py-24 bg-slate-50 relative overflow-hidden">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/20 rounded-full blur-[120px] -ml-64 -mb-64"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div class="text-center md:text-left mb-16">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[10px] uppercase tracking-widest mb-6">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    Únete al Crecimiento
                </div>
                <h2 class="text-4xl md:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight tracking-tight">
                    Oportunidades <span class="text-orange-500">Activas</span>
                </h2>
                <p class="text-gray-500 font-medium max-w-2xl text-lg leading-relaxed italic">
                    "Buscamos mentes brillantes y corazones comprometidos para transformar realidades en La Guajira."
                </p>
            </div>

            <div *ngIf="vacantes.length > 0; else noVacancies" class="grid lg:grid-cols-2 gap-10">
                <div *ngFor="let item of vacantes" 
                    class="group relative bg-white rounded-[3rem] p-1 shadow-2xl shadow-slate-200/40 hover:shadow-orange-500/10 transition-all duration-500 border border-transparent hover:border-orange-100 overflow-hidden">
                    
                    <div class="p-8 md:p-10 flex flex-col h-full bg-white rounded-[2.8rem]">
                        <div class="flex flex-wrap items-center gap-3 mb-6">
                            <span class="px-4 py-1.5 bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                                {{ item.type }}
                            </span>
                            <span class="px-4 py-1.5 bg-orange-50 text-orange-600 border border-orange-100 text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                                <i class="fas fa-map-marker-alt"></i> {{ item.location }}
                            </span>
                        </div>

                        <h3 class="text-2xl md:text-3xl font-black text-gray-900 mb-6 group-hover:text-orange-500 transition-colors leading-tight">{{ item.title }}</h3>
                        
                        <p class="text-gray-500 text-[15px] leading-relaxed mb-8 flex-1">
                            {{ item.description }}
                        </p>
                        
                        <div class="space-y-4 mb-10">
                            <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <i class="fas fa-check-circle text-orange-500"></i> Lo que buscamos:
                            </h4>
                            <div class="flex flex-wrap gap-2">
                                <span *ngFor="let req of item.requirements" 
                                    class="text-[11px] font-bold text-gray-600 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 transition-colors group-hover:bg-orange-50/50 group-hover:border-orange-100/50">
                                    {{ req }}
                                </span>
                            </div>
                        </div>

                        <div class="pt-8 border-t border-gray-100 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span class="text-[10px] font-black text-green-600 uppercase tracking-widest">Postulación Abierta</span>
                            </div>
                            
                            <button (click)="apply(item.id!)" 
                                class="bg-gray-900 hover:bg-orange-500 text-white px-8 py-3.5 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-gray-900/10 flex items-center gap-3">
                                <span class="text-xs font-black uppercase tracking-widest">Postularme ahora</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ng-template #noVacancies>
                <div class="bg-white rounded-[4rem] p-12 md:p-24 text-center border-2 border-dashed border-slate-200 relative overflow-hidden group">
                    <div class="absolute inset-0 bg-slate-50/50 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div class="relative z-10">
                        <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <i class="fas fa-briefcase text-4xl text-slate-300 group-hover:text-orange-300 transition-colors"></i>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">No hay vacantes abiertas por ahora</h3>
                        <p class="text-gray-500 max-w-md mx-auto font-medium mb-10 italic leading-relaxed">
                            Aun así, queremos conocerte. Envíanos tu hoja de vida a <strong>social&#64;fwsa.org</strong> y te contactaremos para futuras oportunidades.
                        </p>
                        <a href="mailto:social@fwsa.org" class="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-gray-900/10">
                            Enviar CV por Email <i class="fas fa-paper-plane"></i>
                        </a>
                    </div>
                </div>
            </ng-template>
        </div>
    </section>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class VacantesListComponent implements OnInit {
    private vacanciesService = inject(VacanciesService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    vacantes: Vacancy[] = [];

    ngOnInit() {
        this.vacanciesService.getVacancies().subscribe(data => {
            this.vacantes = data;
            this.cdr.detectChanges();
        });
    }

    apply(id: string) {
        this.router.navigate(['/unete/postular', id]);
    }
}
