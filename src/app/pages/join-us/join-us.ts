import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacantesListComponent } from '../../shared/components/vacantes-list/vacantes-list.component';

@Component({
    selector: 'app-join-us',
    standalone: true,
    imports: [CommonModule, VacantesListComponent],
    template: `
    <!-- Hero Section -->
    <section class="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900 px-4">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/40 to-transparent z-10"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900 z-10"></div>
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2084"
                class="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
                alt="Join Us Background">
        </div>

        <div class="relative z-20 max-w-5xl mx-auto text-center pt-24 pb-12">
            <div class="flex justify-center mb-8">
                <span class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-orange-500/10 backdrop-blur-md border border-orange-500/20 text-orange-400 font-black text-[11px] uppercase tracking-[0.25em] animate-fadeIn">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    Talento con Propósito
                </span>
            </div>
            
            <h1 class="text-5xl md:text-8xl font-heading font-black text-white mb-8 leading-[0.9] uppercase tracking-tighter">
                Transforma el <br>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Futuro</span> con Nosotros
            </h1>
            
            <p class="text-gray-400 text-sm md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic animate-fadeInDelay">
                "Buscamos mentes apasionadas listas para dejar una huella imborrable en el corazón de nuestras comunidades."
            </p>

            <div class="mt-12 flex justify-center">
                <div class="w-px h-16 bg-gradient-to-b from-orange-500 to-transparent"></div>
            </div>
        </div>

        <!-- Wave Separator -->
        <div class="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
            <svg class="w-full h-16 text-slate-50" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="currentColor">
                <path d="M0,54 L1440,54 L1440,27 C1200,54 960,54 720,27 C480,0 240,0 0,27 L0,54 Z"></path>
            </svg>
        </div>
    </section>

    <!-- Vacancies List -->
    <app-vacantes-list></app-vacantes-list>

    <!-- Process Steps -->
    <section class="py-32 bg-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div class="text-center mb-20">
                <h2 class="text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">Tu camino hacia <span class="text-orange-500">el cambio</span></h2>
                <p class="text-gray-500 font-medium italic">Un proceso transparente enfocado en conocer tu potencial.</p>
            </div>

            <div class="grid md:grid-cols-3 gap-12">
                <!-- Step 1 -->
                <div class="group relative p-10 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2">
                    <div class="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-xl font-black mb-8 transform group-hover:rotate-6 transition-transform">01</div>
                    <h3 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Elige tu rol</h3>
                    <p class="text-gray-500 text-sm leading-relaxed font-medium">Explora las vacantes que conectan con tu propósito profesional o personal.</p>
                </div>

                <!-- Step 2 -->
                <div class="group relative p-10 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2">
                    <div class="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-xl font-black mb-8 transform group-hover:-rotate-6 transition-transform">02</div>
                    <h3 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Postúlate</h3>
                    <p class="text-gray-500 text-sm leading-relaxed font-medium">Completa el formulario con tus datos y cuéntanos qué te motiva a unirte a FWSA.</p>
                </div>

                <!-- Step 3 -->
                <div class="group relative p-10 rounded-[3rem] bg-slate-50 border border-slate-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2">
                    <div class="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-xl font-black mb-8 transform group-hover:rotate-6 transition-transform">03</div>
                    <h3 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Entrevista</h3>
                    <p class="text-gray-500 text-sm leading-relaxed font-medium">Si tu perfil encaja, conversaremos para profundizar en tus metas y nuestra visión.</p>
                </div>
            </div>
        </div>
    </section>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class JoinUsComponent { }
