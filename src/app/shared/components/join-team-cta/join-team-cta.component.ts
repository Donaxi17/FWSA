import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-join-team-cta',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-20 bg-slate-50 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl -mr-48 -mt-48"></div>
        
        <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div class="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-orange-500/5 border border-gray-100 flex flex-col md:flex-row items-center gap-10 md:gap-20">
                <div class="flex-1 text-center md:text-left">
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-6">
                        <span class="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        <span class="text-[10px] font-black text-orange-600 uppercase tracking-widest">¡Te estamos buscando!</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-heading font-black text-gray-900 mb-6 leading-tight">
                        Hazte parte de nuestro <span class="text-orange-500 underline decoration-orange-200 underline-offset-8">equipo</span>
                    </h2>
                    <p class="text-gray-500 text-sm md:text-lg mb-8 leading-relaxed font-medium max-w-xl">
                        ¿Quieres impactar positivamente en La Guajira? Únete a una organización que valora tu talento y compromiso con la transformación social.
                    </p>
                    <button (click)="navigateToJobs()"
                        class="group relative inline-flex items-center justify-center px-8 py-4 font-black text-white bg-gray-900 rounded-2xl overflow-hidden transition-all hover:bg-orange-500 active:scale-95 shadow-xl shadow-gray-900/10">
                        <span class="relative z-10 flex items-center gap-2 text-xs uppercase tracking-widest">
                            Ver Vacantes Disponibles
                            <i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </span>
                    </button>
                </div>

                <div class="w-full md:w-2/5 grid grid-cols-2 gap-4">
                    <div class="space-y-4">
                        <div class="bg-orange-500 p-6 rounded-[2.5rem] text-white shadow-lg shadow-orange-500/20 translate-y-4">
                            <i class="fas fa-users text-2xl mb-4"></i>
                            <h4 class="text-xs font-black uppercase tracking-widest opacity-80">Ambiente</h4>
                            <p class="text-lg font-bold">Colaborativo</p>
                        </div>
                        <div class="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-lg shadow-slate-900/10">
                            <i class="fas fa-heart text-2xl mb-4 text-orange-400"></i>
                            <h4 class="text-xs font-black uppercase tracking-widest opacity-80">Enfoque</h4>
                            <p class="text-lg font-bold">Social</p>
                        </div>
                    </div>
                    <div class="space-y-4 pt-8">
                        <div class="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <i class="fas fa-chart-line text-2xl mb-4 text-orange-500"></i>
                            <h4 class="text-xs font-black uppercase tracking-widest text-gray-400">Crecimiento</h4>
                            <p class="text-lg font-bold text-gray-900">Profesional</p>
                        </div>
                        <div class="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 shadow-sm translate-y-4">
                            <i class="fas fa-globe-americas text-2xl mb-4 text-orange-600"></i>
                            <h4 class="text-xs font-black uppercase tracking-widest text-orange-400">Impacto</h4>
                            <p class="text-lg font-bold text-gray-900">Territorial</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class JoinTeamCtaComponent {
    private router = inject(Router);

    navigateToJobs() {
        this.router.navigate(['/unete']);
    }
}
