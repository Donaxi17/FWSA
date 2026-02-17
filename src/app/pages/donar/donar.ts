import { Component } from '@angular/core';

@Component({
  selector: 'app-donar',
  standalone: true,
  imports: [],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-800">
        <!-- Background Content -->
        <div class="absolute inset-0 z-0">
            <div class="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80 z-10"></div>
            <img src="/assets/images/weaving.png" 
                class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay scale-110" alt="Donar Background">
        </div>

        <!-- Content Wrapper -->
        <div class="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20 pb-12">
            <!-- Badge -->
            <div class="flex justify-center mb-6">
                <span class="inline-block px-5 py-2.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary font-bold text-xs uppercase tracking-widest">
                    Acción Social
                </span>
            </div>

            <!-- Main Title -->
            <h1 class="text-xl md:text-6xl lg:text-7xl font-heading font-black text-white mb-4 leading-tight uppercase tracking-tight">
                Tu apoyo <span class="text-primary">transforma vidas</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-[13px] md:text-xl text-white/90 max-w-5xl mx-auto leading-relaxed font-medium pb-12">
               Tu apoyo hace posible que más personas accedan a oportunidades de formación, emprendimiento, empleabilidad y bienestar emocional. Cada aporte contribuye al desarrollo integral de comunidades vulnerables y al fortalecimiento de procesos educativos y sociales en La Guajira.
            </p>
        </div>

        <!-- Bottom Wave -->
        <div class="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
            <svg class="w-full h-12 md:h-20 text-background" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="currentColor">
                <path d="M0,74 L1440,74 L1440,37 C1200,0 960,0 720,37 C480,74 240,74 0,37 L0,74 Z"></path>
            </svg>
        </div>
    </section>

    <!-- Donation Methods Section -->
    <section class="py-12 md:py-32 bg-background">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="text-center max-w-3xl mx-auto mb-8 md:mb-16">
                <h2 class="text-lg md:text-5xl font-heading font-black text-gray-900 mb-6 leading-tight uppercase">
                    Formas de <span class="text-primary">Contribuir</span>
                </h2>
                <div class="w-20 h-1.5 bg-primary mx-auto mb-4 md:mb-8 rounded-full"></div>
            </div>

            <div class="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
                <!-- Card 1: Transferencia Bancaria -->
                <div class="group relative bg-white rounded-[2rem] p-8 md:p-14 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <!-- Icon -->
                    <div class="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 mx-auto md:mx-0">
                        <svg class="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2-0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    
                    <h3 class="relative z-10 text-lg md:text-2xl font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-tight text-center md:text-left">Transferencia Bancaria</h3>
                    
                    <div class="relative z-10 space-y-4">
                        <div class="flex justify-between items-center py-3 border-b border-gray-50">
                            <span class="text-gray-500 font-bold text-xs uppercase tracking-widest">Banco</span>
                            <span class="text-gray-900 font-black">Bancolombia</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-gray-50">
                            <span class="text-gray-500 font-bold text-xs uppercase tracking-widest">Tipo</span>
                            <span class="text-gray-900 font-black">Cuenta de Ahorros</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-gray-50">
                            <span class="text-gray-500 font-bold text-xs uppercase tracking-widest">Número</span>
                            <span class="text-gray-900 font-black tracking-wider">XXX-XXXXXX-XX</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-gray-50">
                            <span class="text-gray-500 font-bold text-xs uppercase tracking-widest">NIT</span>
                            <span class="text-gray-900 font-black tracking-wider">XXXXXXX-X</span>
                        </div>
                    </div>

                    <!-- Decorative elements -->
                    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                </div>

                <!-- Card 2: Otros Medios -->
                <div class="group relative bg-white rounded-[2rem] p-8 md:p-14 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                    <!-- Icon -->
                    <div class="relative z-10 w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 mx-auto md:mx-0">
                        <svg class="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    
                    <h3 class="relative z-10 text-lg md:text-2xl font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-tight text-center md:text-left">Plataformas Digitales</h3>
                    
                    <p class="relative z-10 text-gray-500 mb-6 md:mb-8 leading-relaxed font-medium text-center md:text-left text-[13px] md:text-base">
                        Estamos trabajando para integrar medios de pago electrónicos (PSE, Wompi, Epayco) para facilitar tus donaciones desde cualquier lugar.
                    </p>

                    <div class="mt-auto">
                        <button disabled class="w-full py-3.5 md:py-5 bg-gray-100 text-gray-400 font-black rounded-2xl cursor-not-allowed uppercase tracking-widest text-xs md:text-sm border-2 border-dashed border-gray-200">
                            Próximamente
                        </button>
                    </div>

                    <!-- Decorative elements -->
                    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors"></div>
                </div>
            </div>

            <!-- Donation Note -->
            <div class="mt-12 md:mt-20 max-w-4xl mx-auto px-4 md:px-0">
                <div class="bg-primary/5 border-2 border-dashed border-primary/30 rounded-[2rem] p-8 md:p-12 text-center group hover:bg-primary transition-colors duration-500">
                    <p class="text-primary group-hover:text-white font-bold italic text-sm md:text-xl leading-relaxed transition-colors duration-500">
                        "Para realizar donaciones en especie o solicitar certificados de donación deducibles de impuestos, por favor contáctanos directamente a través de nuestros canales oficiales."
                    </p>
                </div>
            </div>
        </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--background);
    }
  `,
})
export class Donar {

}
