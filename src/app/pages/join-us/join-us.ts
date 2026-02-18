import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacantesListComponent } from '../../shared/components/vacantes-list/vacantes-list.component';

@Component({
    selector: 'app-join-us',
    standalone: true,
    imports: [CommonModule, VacantesListComponent],
    template: `
    <!-- Hero Section (More Compact) -->
    <section class="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-slate-900 px-4">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-transparent z-10"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900 z-10"></div>
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2084"
                class="absolute inset-0 w-full h-full object-cover opacity-20 scale-105"
                alt="Join Us Background">
        </div>

        <div class="relative z-20 max-w-5xl mx-auto text-center pt-20 pb-8">
            <div class="flex justify-center mb-6">
                <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/20 text-orange-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.25em] animate-fadeIn">
                    <span class="w-1 h-1 rounded-full bg-orange-500"></span>
                    Talento con Propósito
                </span>
            </div>
            
            <h1 class="text-4xl md:text-7xl font-heading font-black text-white mb-6 leading-[0.9] uppercase tracking-tighter">
                Únete al <br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Cambio</span>
            </h1>
            
            <p class="text-gray-400 text-xs md:text-lg max-w-xl mx-auto font-medium leading-relaxed italic animate-fadeInDelay">
                "Deja una huella imborrable en nuestras comunidades."
            </p>

            <div class="mt-8 flex justify-center">
                <div class="w-px h-10 bg-gradient-to-b from-orange-500 to-transparent"></div>
            </div>
        </div>

        <!-- Wave Separator -->
        <div class="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
            <svg class="w-full h-12 text-background" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="currentColor">
                <path d="M0,54 L1440,54 L1440,27 C1200,54 960,54 720,27 C480,0 240,0 0,27 L0,54 Z"></path>
            </svg>
        </div>
    </section>

    <!-- Process Steps (Tighter) -->
    <section class="py-16 md:py-24 bg-white relative overflow-hidden">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div class="text-center mb-12">
                <h2 class="text-2xl md:text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Tu camino al <span class="text-orange-500">éxito</span></h2>
                <p class="text-gray-500 text-xs md:text-sm font-medium italic">Un proceso transparente y enfocado en ti.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                <!-- Step 1 -->
                <div class="group relative p-8 rounded-[2rem] bg-background border border-gray-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10">
                    <div class="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-base font-black mb-6 transform group-hover:rotate-6 transition-transform">01</div>
                    <h3 class="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Postúlate</h3>
                    <p class="text-gray-500 text-xs leading-relaxed font-medium">Explora vacantes y comparte tu perfil.</p>
                </div>

                <!-- Step 2 -->
                <div class="group relative p-8 rounded-[2rem] bg-background border border-gray-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10">
                    <div class="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center text-base font-black mb-6 transform group-hover:-rotate-6 transition-transform">02</div>
                    <h3 class="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Revisión</h3>
                    <p class="text-gray-500 text-xs leading-relaxed font-medium">Evaluamos tu talento y propósito.</p>
                </div>

                <!-- Step 3 -->
                <div class="group relative p-8 rounded-[2rem] bg-background border border-gray-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10">
                    <div class="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-base font-black mb-6 transform group-hover:rotate-6 transition-transform">03</div>
                    <h3 class="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Bienvenido</h3>
                    <p class="text-gray-500 text-xs leading-relaxed font-medium">¡Únete a nuestra gran familia!</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Vacancies List -->
    <app-vacantes-list></app-vacantes-list>
    
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class JoinUsComponent { }
