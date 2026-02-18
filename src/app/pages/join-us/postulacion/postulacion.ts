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
    <section class="min-h-screen bg-background py-6 md:py-10 px-4 flex items-center justify-center">
        <div class="max-w-5xl w-full mx-auto">
            <!-- Back Link -->
            <a routerLink="/unete" class="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 transition-colors group">
                <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                Volver
            </a>
 
            <!-- Card Container -->
            <div *ngIf="!isLoading && vacancy" class="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-gray-100 overflow-hidden animate-fadeIn">
                <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                    
                    <!-- Sidebar Info (More Compact) -->
                    <div class="lg:col-span-4 bg-slate-900 p-6 md:p-10 text-white relative overflow-hidden flex flex-col justify-between">
                        <div class="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>
                        
                        <div class="relative z-10">
                            <div class="mb-8">
                                <span class="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-md mb-4 border border-orange-500/20">
                                    Aplicando a:
                                </span>
                                <h1 class="text-2xl md:text-4xl font-black leading-tight mb-4 text-white tracking-tight">
                                    {{ vacancy.title }}
                                </h1>
                                <div class="w-12 h-1 bg-orange-500 rounded-full"></div>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="flex items-center gap-4 group/item">
                                    <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <i class="fas fa-map-marker-alt text-orange-400 text-base"></i>
                                    </div>
                                    <div>
                                        <p class="text-[9px] font-black uppercase tracking-widest text-white/30">Ubicación</p>
                                        <p class="text-sm font-bold text-white">{{ vacancy.location }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4 group/item">
                                    <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <i class="fas fa-clock text-orange-400 text-base"></i>
                                    </div>
                                    <div>
                                        <p class="text-[9px] font-black uppercase tracking-widest text-white/30">Tipo</p>
                                        <p class="text-sm font-bold text-white">{{ vacancy.type }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 hidden lg:block">
                            <p class="text-[10px] text-gray-400 italic leading-relaxed font-medium">
                                "Tu talento puede transformar vidas."
                            </p>
                        </div>
                    </div>
 
                    <!-- Form Area (More Compact) -->
                    <div class="lg:col-span-8 p-6 md:p-10 bg-white">
                        <div *ngIf="!submitted; else successMessage">
                            <div class="mb-6">
                                <h2 class="text-xl font-black text-gray-900 mb-1 uppercase tracking-tight">Formulario</h2>
                                <p class="text-gray-400 text-[11px] font-medium italic">Completa tus datos con cuidado.</p>
                            </div>
                            
                            <form #applyForm="ngForm" (ngSubmit)="onSubmit(applyForm)" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-1.5">
                                        <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Nombre</label>
                                        <input type="text" name="name" ngModel required
                                            class="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm text-gray-900"
                                            placeholder="Ej: Juan Pérez">
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Correo</label>
                                        <input type="email" name="email" ngModel required email
                                            class="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm text-gray-900"
                                            placeholder="tu@ejemplo.com">
                                    </div>
                                </div>
 
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-1.5">
                                        <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Teléfono</label>
                                        <input type="tel" name="phone" ngModel required
                                            class="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm text-gray-900"
                                            placeholder="+57 300 000 0000">
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Experiencia</label>
                                        <div class="relative">
                                            <select name="experience" ngModel required
                                                class="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm text-gray-900 appearance-none">
                                                <option value="">Seleccionar...</option>
                                                <option value="Sin experiencia">Sin experiencia</option>
                                                <option value="1-2 años">1-2 años</option>
                                                <option value="3-5 años">3-5 años</option>
                                                <option value="Más de 5 años">Más de 5 años</option>
                                            </select>
                                            <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none text-[10px]"></i>
                                        </div>
                                    </div>
                                </div>
 
                                <div class="space-y-1.5">
                                    <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Tu Motivación</label>
                                    <textarea name="motivation" ngModel required rows="3"
                                        class="w-full px-4 py-3 bg-slate-50 border border-slate-100 focus:border-orange-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-sm text-gray-900 resize-none"
                                        placeholder="Cuéntanos por qué quieres unirte..."></textarea>
                                </div>
 
                                <div class="pt-2">
                                    <button type="submit" [disabled]="applyForm.invalid || isSubmitting"
                                        class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95 group">
                                        <span class="text-[10px] uppercase tracking-[0.2em]" *ngIf="!isSubmitting">Enviar Postulación</span>
                                        <span class="text-[10px] uppercase tracking-[0.2em]" *ngIf="isSubmitting">Procesando...</span>
                                        <i *ngIf="!isSubmitting" class="fas fa-paper-plane text-xs"></i>
                                        <i *ngIf="isSubmitting" class="fas fa-circle-notch animate-spin text-xs"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
 
                        <ng-template #successMessage>
                            <div class="flex flex-col items-center justify-center h-full text-center py-6 animate-fadeIn">
                                <div class="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl mb-4">
                                    <i class="fas fa-check"></i>
                                </div>
                                <h2 class="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">¡Enviado!</h2>
                                <p class="text-xs text-gray-500 font-medium mb-6 max-w-xs leading-relaxed italic">
                                    Recibimos tu postulación para <strong>{{ vacancy.title }}</strong>.
                                </p>
                                <button routerLink="/unete" 
                                    class="px-8 py-3 bg-gray-900 text-white font-black rounded-xl text-[9px] uppercase tracking-[0.2em] hover:bg-orange-500 transition-all">
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
