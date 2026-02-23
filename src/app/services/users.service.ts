import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, collection, collectionData, setDoc, deleteDoc, doc, CollectionReference, query, where } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor';
    createdAt?: any;
}

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly firestore = inject(Firestore);
    private readonly ngZone = inject(NgZone);
    private readonly usersCollection: CollectionReference;

    constructor() {
        this.usersCollection = collection(this.firestore, 'admin_users');
    }

    getUsers(): Observable<AdminUser[]> {
        return (collectionData(this.usersCollection, { idField: 'id' }) as Observable<AdminUser[]>).pipe(
            catchError(err => {
                console.warn('Firestore Users Permission Warning:', err.message);
                return of([]);
            })
        );
    }

    async saveUser(user: AdminUser) {
        return this.ngZone.run(async () => {
            const userDoc = doc(this.firestore, `admin_users/${user.id}`);
            return await setDoc(userDoc, {
                ...user,
                email: user.email.toLowerCase(),
                createdAt: user.createdAt || new Date()
            }, { merge: true }); // Merge true para evitar sobreescribir si ya existe
        });
    }

    async deleteUser(id: string) {
        const userDoc = doc(this.firestore, `admin_users/${id}`);
        return await deleteDoc(userDoc);
    }

    /**
     * Helper to check a specific user role by email
     */
    getUserByEmail(email: string): Observable<AdminUser | null> {
        const q = query(this.usersCollection, where('email', '==', email.toLowerCase()));
        return (collectionData(q) as Observable<AdminUser[]>).pipe(
            map(users => users.length > 0 ? users[0] : null),
            catchError(() => of(null))
        );
    }
}
