import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacanciesService } from '../../services/vacancies.service';

@Component({
    selector: 'app-contacto',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contacto.html',
    styleUrls: ['./contacto.css']
})
export class ContactoComponent {
    private vacanciesService = inject(VacanciesService);
    private cdr = inject(ChangeDetectorRef);

    contactForm = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    };

    isLoading = false;
    isSubmitted = false;
    toast = {
        show: false,
        message: '',
        type: 'success'
    };

    contactInfo = [
        {
            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
            title: 'CORREO INSTITUCIONAL',
            value: 'contacto@fwsa.org.co',
            desc: 'Soporte 24/7 para proyectos',
            link: 'mailto:contacto@fwsa.org.co'
        },
        {
            icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-4.821 4.754a8.117 8.117 0 0 1-3.8-.934l-.272-.162-2.83.742.753-2.76-.177-.282a8.108 8.108 0 0 1-1.242-4.317c0-4.483 3.65-8.128 8.129-8.128 2.173 0 4.217.846 5.754 2.382a8.073 8.073 0 0 1 2.38 5.746c0 4.488-3.65 8.135-8.128 8.135m8.124-16.225A11.229 11.229 0 0 0 12.66 0C5.705 0 0 5.703 0 12.659c0 2.223.579 4.392 1.681 6.305L0 24l5.135-1.348a12.61 12.61 0 0 0 7.525 2.006c6.953 0 12.658-5.703 12.658-12.66 0-3.374-1.312-6.545-3.696-8.928',
            title: 'WHATSAPP OFICIAL',
            value: '+57 300 525 1713',
            desc: 'Respuesta inmediata vía chat',
            link: 'https://wa.me/573005251713'
        },
        {
            icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
            title: 'UBICACIÓN',
            value: 'Calle 7 # 15-22',
            desc: 'Riohacha, La Guajira - Colombia',
            link: '#ubicacion'
        }
    ];

    socialLinks = [
        {
            name: 'Facebook',
            path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
            url: '#',
            color: 'hover:bg-[#1877F2] hover:text-white'
        },
        {
            name: 'Instagram',
            path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM18.406 4.155a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881zM12 16a4 4 0 110-8 4 4 0 010 8z',
            url: '#',
            color: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white'
        },
        {
            name: 'Twitter',
            path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
            url: '#',
            color: 'hover:bg-black hover:text-white'
        },
        {
            name: 'LinkedIn',
            path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
            url: '#',
            color: 'hover:bg-[#0077b5] hover:text-white'
        }
    ];

    onSubmit() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.cdr.detectChanges();

        const messageData = {
            ...this.contactForm,
            isContact: true // Flag para que el backend sepa que es contacto
        };

        // 1. Guardar en Firestore para respaldo
        this.vacanciesService.addContactMessage(messageData)
            .then(async () => {
                console.log('Mensaje guardado en Firestore');

                // 2. Enviar notificación por Email
                try {
                    await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(messageData)
                    });
                    console.log('Notificación de contacto enviada');
                } catch (mailErr) {
                    console.warn('Fallo el envío del email, pero el mensaje se guardó en BD');
                }

                this.isLoading = false;
                this.isSubmitted = true;

                // Show toast for PC
                this.showToast('¡Mensaje enviado correctamente!', 'success');

                // Auto-scroll to success message with offset (slightly higher)
                setTimeout(() => {
                    const el = document.getElementById('success-message');
                    if (el) {
                        const yOffset = -120; // Offset para que quede "más arriba"
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                }, 100);

                this.resetForm();
                this.cdr.detectChanges();

                setTimeout(() => {
                    this.isSubmitted = false;
                    this.cdr.detectChanges();
                }, 5000);
            })
            .catch(err => {
                console.error('Error al guardar mensaje:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
                alert('Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.');
            });
    }

    scrollToUbicacion(event: Event) {
        event.preventDefault();
        const element = document.getElementById('ubicacion');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    resetForm() {
        this.contactForm = {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        };
    }

    showToast(message: string, type: 'success' | 'error' = 'success') {
        this.toast = { show: true, message, type };
        this.cdr.detectChanges();
        setTimeout(() => {
            this.toast.show = false;
            this.cdr.detectChanges();
        }, 5000);
    }
}
