import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLoginComponent } from './components/login/login';
import { AdminPanelComponent } from './components/panel/panel';
import { AuthService } from '../../services/auth.service';
import { map } from 'rxjs';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, AdminLoginComponent, AdminPanelComponent],
    templateUrl: './admin.html',
    styleUrls: ['./admin.css']
})
export class AdminComponent {
    private authService = inject(AuthService);

    // Track if Firebase is still checking the session
    authReady$ = this.authService.authReady$;

    // Check if user is logged in using the auth observable
    isLoggedIn$ = this.authService.user$.pipe(
        map(user => !!user)
    );

    onLoginSuccess() {
        // The isLoggedIn$ observable will automatically update
    }

    async onLogout() {
        try {
            await this.authService.logout();
        } catch (error) {
            console.error('Error logging out', error);
        }
    }
}
