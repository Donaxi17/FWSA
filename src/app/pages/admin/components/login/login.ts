import { Component, EventEmitter, Output, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-admin-login',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html'
})
export class AdminLoginComponent {
    @Output() loginSuccess = new EventEmitter<void>();

    private authService = inject(AuthService);
    private ngZone = inject(NgZone);
    private cdr = inject(ChangeDetectorRef);

    email = '';
    password = '';
    showRecover = false;
    showPassword = false;
    errorMessage = '';
    successMessage = '';
    isLoading = false;

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    async onLogin() {
        if (!this.email || !this.password) {
            this.errorMessage = 'Por favor ingresa todos los campos.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        this.cdr.detectChanges();

        try {
            await this.authService.login(this.email, this.password);
            this.ngZone.run(() => {
                this.loginSuccess.emit();
            });
        } catch (error: any) {
            console.error('Login error', error);
            this.ngZone.run(() => {
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    this.errorMessage = 'Correo o contraseña incorrectos.';
                } else if (error.code === 'auth/too-many-requests') {
                    this.errorMessage = 'Demasiados intentos. Intenta más tarde.';
                } else {
                    this.errorMessage = 'Ocurrió un error: ' + (error.code || error.message);
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        } finally {
            this.ngZone.run(() => {
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        }
    }

    toggleRecover() {
        this.showRecover = !this.showRecover;
        this.errorMessage = '';
        this.successMessage = '';
    }

    async onRecover() {
        if (!this.email) {
            this.errorMessage = 'Ingresa tu correo para continuar.';
            this.cdr.detectChanges();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';
        this.cdr.detectChanges();

        try {
            await this.authService.resetPassword(this.email);
            this.ngZone.run(() => {
                this.successMessage = 'Se ha enviado un enlace de recuperación a tu correo.';
                this.isLoading = false;
                // Opcionalmente volver al login después de unos segundos
                setTimeout(() => {
                    this.showRecover = false;
                    this.successMessage = '';
                    this.cdr.detectChanges();
                }, 5000);
                this.cdr.detectChanges();
            });
        } catch (error: any) {
            console.error('Recover error', error);
            this.ngZone.run(() => {
                if (error.code === 'auth/user-not-found') {
                    this.errorMessage = 'No existe un usuario con este correo.';
                } else {
                    this.errorMessage = 'Error al enviar el correo de recuperación.';
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            });
        }
    }
}
