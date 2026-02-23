import { Injectable, inject, NgZone } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User, sendPasswordResetEmail, createUserWithEmailAndPassword, updateProfile, getAuth, authState, onAuthStateChanged } from '@angular/fire/auth';
import { initializeApp, getApp, getApps, FirebaseApp } from '@angular/fire/app';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, take, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    private ngZone = inject(NgZone);
    private authReadySubject = new BehaviorSubject<boolean>(false);

    // Observable that tells us if Firebase has finished the local session check
    authReady$ = this.authReadySubject.asObservable();

    user$: Observable<User | null> = this.ngZone.run(() => authState(this.auth)); // Wrap authState

    private secondaryAuth: Auth | null = null;

    constructor() {
        // This listener is independent of subscriptions and will trigger as soon as Firebase is ready
        this.ngZone.run(() => { // Wrap onAuthStateChanged
            onAuthStateChanged(this.auth, () => {
                if (!this.authReadySubject.value) {
                    this.authReadySubject.next(true);
                }
            });
        });
    }

    login(email: string, pass: string) {
        return this.ngZone.run(() =>
            signInWithEmailAndPassword(this.auth, email, pass)
        );
    }

    resetPassword(email: string) {
        return this.ngZone.run(() =>
            sendPasswordResetEmail(this.auth, email)
        );
    }

    private getSecondaryAuth() {
        if (this.secondaryAuth) return this.secondaryAuth;

        let secondaryApp: FirebaseApp;
        const apps = getApps();
        const existingApp = apps.find(app => app.name === 'Secondary');

        if (existingApp) {
            secondaryApp = existingApp;
        } else {
            secondaryApp = initializeApp(environment.firebase, 'Secondary');
        }

        this.secondaryAuth = getAuth(secondaryApp);
        return this.secondaryAuth;
    }

    // Creates a user without logging out the current admin
    async adminCreateUser(name: string, email: string, pass: string) {
        return this.ngZone.run(async () => {
            const sAuth = this.getSecondaryAuth();
            try {
                const userCredential = await createUserWithEmailAndPassword(sAuth, email, pass);
                await updateProfile(userCredential.user, { displayName: name });
                await signOut(sAuth); // Clear secondary session
                return userCredential.user;
            } catch (error) {
                throw error;
            }
        });
    }

    logout() {
        return this.ngZone.run(() => signOut(this.auth));
    }
}
