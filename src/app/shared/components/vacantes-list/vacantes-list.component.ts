import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VacanciesService, Vacancy } from '../../../services/vacancies.service';

@Component({
    selector: 'app-vacantes-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section id="vacantes-section" class="py-24 bg-background relative overflow-hidden">
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

            <div *ngIf="vacantes.length > 0; else noVacancies" class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                <div *ngFor="let item of vacantes" 
                    class="group relative bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-orange-200 transition-all duration-500 overflow-hidden flex flex-col h-full">
                    
                    <!-- Decorative Gradient Top -->
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>

                    <!-- Header -->
                    <div class="p-6 md:p-8 pb-4 flex flex-wrap justify-between items-start gap-4">
                        <div class="flex flex-wrap gap-2">
                            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg border border-slate-100 transition-colors group-hover:bg-slate-100">
                                <i class="fas fa-briefcase text-[10px] text-slate-400"></i>
                                <span class="text-[10px] font-bold uppercase tracking-wider">{{ item.type }}</span>
                            </div>
                            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg border border-orange-100/50">
                                <i class="fas fa-map-marker-alt text-[10px]"></i>
                                <span class="text-[10px] font-bold uppercase tracking-wider">{{ item.location }}</span>
                            </div>
                        </div>
                        
                        <!-- Dynamic Status -->
                        <div [ngClass]="item.status === 'Abierta' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100 text-slate-400'" 
                             class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg ring-4 ring-white transition-all">
                            <span class="relative flex h-2 w-2" *ngIf="item.status === 'Abierta'">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            {{ item.status === 'Abierta' ? 'Activa' : 'Cerrada' }}
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="px-6 md:px-8 pb-6 flex-1 flex flex-col">
                        <h3 class="text-xl md:text-3xl font-black text-slate-900 mb-4 group-hover:text-orange-500 transition-colors leading-tight">
                            {{ item.title }}
                        </h3>
                        
                        <p class="text-slate-500 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                            {{ item.description }}
                        </p>
                        
                        <!-- Requirements -->
                        <div class="mt-auto pt-6 border-t border-slate-50">
                            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <i class="fas fa-check-circle text-orange-500"></i> Lo que buscamos:
                            </h4>
                            <div class="flex flex-wrap gap-2">
                                <span *ngFor="let req of item.requirements" 
                                    class="text-[11px] font-medium text-slate-600 bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100 transition-all group-hover:bg-orange-100/10 group-hover:border-orange-200/50">
                                    {{ req }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Action -->
                    <div class="p-6 md:p-8 pt-4">
                        <button (click)="apply(item.id!)" [disabled]="item.status !== 'Abierta'"
                            class="w-full relative group/btn overflow-hidden bg-slate-900 disabled:bg-slate-200 text-white disabled:text-slate-400 py-4 rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-3 border-none disabled:cursor-not-allowed">
                            <span class="relative z-10">{{ item.status === 'Abierta' ? 'Postularme ahora' : 'No disponible' }}</span>
                            <i *ngIf="item.status === 'Abierta'" class="fas fa-arrow-right relative z-10 transition-transform group-hover/btn:translate-x-1.5"></i>
                            <i *ngIf="item.status !== 'Abierta'" class="fas fa-lock text-[10px] opacity-40"></i>
                            
                            <!-- Premium Hover Effect (Only for active) -->
                            <div *ngIf="item.status === 'Abierta'" class="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
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
