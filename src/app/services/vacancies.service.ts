import { Injectable, inject, NgZone } from '@angular/core';
import {
    Firestore, collection, collectionData, doc,
    addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp,
    CollectionReference
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Vacancy {
    id?: string;
    title: string;
    location: string;
    type: 'Tiempo Completo' | 'Medio Tiempo' | 'Voluntariado' | 'Remoto' | 'Freelance' | 'Logística';
    description: string;
    requirements: string[];
    status: 'Abierta' | 'Cerrada';
    createdAt?: any;
}

@Injectable({
    providedIn: 'root'
})
export class VacanciesService {
    private readonly firestore = inject(Firestore);
    private readonly ngZone = inject(NgZone);
    private readonly vacanciesCollection: CollectionReference;

    constructor() {
        this.vacanciesCollection = collection(this.firestore, 'vacancies');
    }

    getVacancies(): Observable<Vacancy[]> {
        const vacanciesQuery = query(this.vacanciesCollection, orderBy('createdAt', 'desc'));
        return (collectionData(vacanciesQuery, { idField: 'id' }) as Observable<Vacancy[]>).pipe(
            catchError(err => {
                console.warn('Firestore Vacancies Error:', err.message);
                return of([]);
            })
        );
    }

    async addVacancy(vacancy: Vacancy) {
        return this.ngZone.run(async () => {
            return await addDoc(this.vacanciesCollection, {
                ...vacancy,
                createdAt: new Date()
            });
        });
    }

    addApplication(application: any) {
        const applicationsCollection = collection(this.firestore, 'postulaciones');
        return addDoc(applicationsCollection, {
            ...application,
            appliedAt: serverTimestamp()
        });
    }

    addContactMessage(message: any) {
        const contactsCollection = collection(this.firestore, 'contactos');
        return addDoc(contactsCollection, {
            ...message,
            createdAt: serverTimestamp()
        });
    }

    async updateVacancy(id: string, vacancy: Partial<Vacancy>) {
        const vacancyDoc = doc(this.firestore, `vacancies/${id}`);
        return this.ngZone.run(async () => {
            return await updateDoc(vacancyDoc, vacancy);
        });
    }

    async deleteVacancy(id: string) {
        const vacancyDoc = doc(this.firestore, `vacancies/${id}`);
        return this.ngZone.run(async () => {
            return await deleteDoc(vacancyDoc);
        });
    }
}
