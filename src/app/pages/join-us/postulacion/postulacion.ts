import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VacanciesService, Vacancy } from '../../../services/vacancies.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-postulacion',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <section class="min-h-screen bg-slate-50 py-12 md:py-20 px-4">
        <div class="max-w-4xl mx-auto">
            <!-- Back Link -->
            <a routerLink="/unete" class="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-8 md:mb-10 transition-colors group">
                <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                Volver a Vacantes
            </a>

            <!-- Loading State -->
            <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-20 animate-fadeIn">
                <div class="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                <p class="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Cargando detalles de la vacante...</p>
            </div>

            <!-- Error / Not Found State -->
            <div *ngIf="!isLoading && !vacancy" class="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200 shadow-xl shadow-slate-200/50">
                <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-exclamation-triangle text-3xl text-slate-300"></i>
                </div>
                <h2 class="text-2xl font-black text-gray-900 mb-4 uppercase text-center">Vacante no encontrada</h2>
                <p class="text-gray-500 mb-8 font-medium text-center">Lo sentimos, la oferta laboral que buscas ya no está disponible o el enlace es incorrecto.</p>
                <div class="flex justify-center">
                    <button routerLink="/unete" class="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all">
                        Ver otras vacantes
                    </button>
                </div>
            </div>

            <div *ngIf="!isLoading && vacancy" class="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-gray-100 overflow-hidden animate-fadeIn">
                <div class="grid grid-cols-1 lg:grid-cols-5">
                    <!-- Sidebar Info -->
                    <div class="lg:col-span-2 bg-gray-900 p-8 md:p-12 text-white">
                        <div class="mb-8 lg:mb-12">
                            <span class="inline-block px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg mb-6 shadow-lg shadow-orange-500/20">
                                Estás aplicando a:
                            </span>
                            <h1 class="text-3xl md:text-4xl font-black leading-tight mb-6">{{ vacancy.title }}</h1>
                            <div class="w-12 h-1 bg-orange-500/30 rounded-full"></div>
                        </div>
                        
                        <div class="space-y-6 md:space-y-8">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <i class="fas fa-map-marker-alt text-orange-400"></i>
                                </div>
                                <div>
                                    <p class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Ubicación</p>
                                    <p class="text-sm font-bold">{{ vacancy.location }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <i class="fas fa-clock text-orange-400"></i>
                                </div>
                                <div>
                                    <p class="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Tipo</p>
                                    <p class="text-sm font-bold">{{ vacancy.type }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-12 lg:mt-24 p-6 bg-white/5 rounded-3xl border border-white/10 hidden lg:block">
                            <p class="text-[11px] text-gray-400 italic leading-relaxed">
                                \"En FWSA valoramos tu talento. Este proceso es el primer paso para juntos transformar vidas en nuestras comunidades.\"
                            </p>
                        </div>
                    </div>

                    <!-- Form Area -->
                    <div class="lg:col-span-3 p-8 md:p-12 lg:p-16 bg-white">
                        <div *ngIf="!submitted; else successMessage">
                            <div class="mb-10">
                                <h2 class="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Formulario de Aplicación</h2>
                                <p class="text-gray-400 text-sm font-medium italic">Por favor completa tus datos con cuidado.</p>
                            </div>
                            
                            <form #applyForm=\"ngForm\" (ngSubmit)=\"onSubmit(applyForm)\" class="space-y-6 md:space-y-8">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <div class="space-y-2">
                                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Nombre Completo</label>
                                        <input type="text" name="name" ngModel required
                                            class="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                            placeholder="Ej: Juan Pérez">
                                    </div>
                                    <div class="space-y-2">
                                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Correo Electrónico</label>
                                        <input type="email" name="email" ngModel required email
                                            class="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                            placeholder="tu@ejemplo.com">
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <div class="space-y-2">
                                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Teléfono / WhatsApp</label>
                                        <input type="tel" name="phone" ngModel required
                                            class="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                            placeholder="+57 300 000 0000">
                                    </div>
                                    <div class="space-y-2">
                                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Años de Experiencia</label>
                                        <div class="relative">
                                            <select name="experience" ngModel required
                                                class="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 appearance-none bg-no-repeat bg-[right_1.5rem_center]">
                                                <option value="">Seleccionar...</option>
                                                <option value="Sin experiencia">Sin experiencia</option>
                                                <option value="1-2 años">1-2 años</option>
                                                <option value="3-5 años">3-5 años</option>
                                                <option value="Más de 5 años">Más de 5 años</option>
                                            </select>
                                            <i class="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Tu Motivación</label>
                                    <textarea name="motivation" ngModel required rows="4"
                                        class="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                                        placeholder="Cuéntanos por qué quieres unirte a este cargo..."></textarea>
                                </div>

                                <div class="pt-6">
                                    <button type="submit" [disabled]="applyForm.invalid || isSubmitting"
                                        class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none text-white font-black py-5 px-8 rounded-[1.5rem] shadow-2xl shadow-orange-500/40 transition-all flex items-center justify-center gap-4 active:scale-95 group">
                                        <span class="text-xs uppercase tracking-[0.2em]" *ngIf="!isSubmitting">Enviar Postulación</span>
                                        <span class="text-xs uppercase tracking-[0.2em]" *ngIf="isSubmitting">Procesando...</span>
                                        <i *ngIf="!isSubmitting" class="fas fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                                        <i *ngIf="isSubmitting" class="fas fa-circle-notch animate-spin"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <ng-template #successMessage>
                            <div class="flex flex-col items-center justify-center h-full text-center py-12 animate-fadeIn">
                                <div class="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl mb-8 shadow-inner">
                                    <i class="fas fa-check"></i>
                                </div>
                                <h2 class="text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight">¡Enviado con éxito!</h2>
                                <p class="text-gray-500 font-medium mb-12 max-w-sm leading-relaxed italic">
                                    Tu postulación para <strong>{{ vacancy.title }}</strong> ha sido recibida. Estaremos en contacto pronto.
                                </p>
                                <button routerLink="/unete" 
                                    class="px-12 py-4 bg-gray-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-xl shadow-gray-900/10">
                                    Volver al listado
                                </button>
                            </div>
                        </ng-template>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `,
    styles: [`
    :host { display: block; }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
        animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class PostulacionComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private vacanciesService = inject(VacanciesService);
    private cdr = inject(ChangeDetectorRef);

    vacancy: Vacancy | null = null;
    isLoading = true;
    isSubmitting = false;
    submitted = false;

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            // Agregamos un timeout de seguridad por si Firebase tarda demasiado
            const timeoutId = setTimeout(() => {
                if (this.isLoading) {
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            }, 5000);

            this.vacanciesService.getVacancies().pipe(take(1)).subscribe({
                next: (vacantes) => {
                    clearTimeout(timeoutId);
                    this.vacancy = vacantes.find(v => v.id === id) || null;
                    this.isLoading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    clearTimeout(timeoutId);
                    console.error('Error fetching vacancy:', err);
                    this.isLoading = false;
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.router.navigate(['/unete']);
        }
    }

    onSubmit(form: any) {
        if (form.valid && this.vacancy) {
            this.isSubmitting = true;
            this.cdr.detectChanges();

            const applicationData = {
                ...form.value,
                vacancyId: this.vacancy.id,
                vacancyTitle: this.vacancy.title
            };

            this.vacanciesService.addApplication(applicationData)
                .then(async () => {
                    console.log('Postulación guardada en Firestore:', applicationData);

                    // Enviamos el correo a través de nuestra nueva API de Vercel
                    try {
                        await fetch('/api/send-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(applicationData)
                        });
                        console.log('Notificación por email enviada');
                    } catch (mailErr) {
                        console.warn('Los datos se guardaron pero falló el envío del email:', mailErr);
                        // No bloqueamos al usuario si el email falla, ya que los datos ya están en Firestore
                    }

                    this.isSubmitting = false;
                    this.submitted = true;
                    this.cdr.detectChanges();
                })
                .catch(err => {
                    console.error('Error al guardar postulación:', err);
                    this.isSubmitting = false;
                    this.cdr.detectChanges();
                    alert('Hubo un error al enviar tu postulación. Por favor intenta de nuevo.');
                });
        }
    }
}
