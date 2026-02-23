import { Injectable, inject, NgZone } from '@angular/core';
import {
    Firestore, collection, collectionData, doc,
    addDoc, updateDoc, deleteDoc, query, orderBy,
    CollectionReference, setDoc
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface TeamMember {
    id?: string;
    name: string;
    role: string;
    description: string;
    image: string;
    order: number;
    createdAt?: any;
}

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private readonly firestore = inject(Firestore);
    private readonly ngZone = inject(NgZone);
    private readonly teamCollection: CollectionReference;

    constructor() {
        this.teamCollection = collection(this.firestore, 'team');
    }

    private defaultMembers: TeamMember[] = [
        { name: 'Yisleine Karina Torres Turizo', role: 'Representante Legal', description: 'Representa legalmente a la Fundación y asegura el correcto funcionamiento institucional.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', order: 1 },
        { name: 'Rodolfo Torres Castillo', role: 'Presidente', description: 'Lidera la dirección estratégica de la Fundación y coordina el desarrollo de planes.', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', order: 2 },
        { name: 'Yaniris Duarte Bula', role: 'Vicepresidente', description: 'Apoya al presidente y fortalece la gestión y seguimiento de las actividades.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800', order: 3 },
        { name: 'Yuranis Bula Espinosa', role: 'Secretaria', description: 'Gestiona la documentación y comunicaciones, apoyando los procesos administrativos.', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800', order: 4 },
        { name: 'Yovert Alberto Duarte Bula', role: 'Tesorero', description: 'Administra los recursos financieros y garantiza su uso transparente.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800', order: 5 },
        { name: 'Yonelis Beatriz Turizo Choles', role: 'Vocal', description: 'Apoya la toma de decisiones y acompaña la ejecución de programas.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800', order: 6 },
        { name: 'Abigail Yiseth Torres Turizo', role: 'Vocal', description: 'Contribuye con propuestas y apoyo en las actividades institucionales.', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800', order: 7 }
    ];

    getTeam(): Observable<TeamMember[]> {
        return this.ngZone.run(() => {
            const teamQuery = query(this.teamCollection, orderBy('order', 'asc'));
            return (collectionData(teamQuery, { idField: 'id' }) as Observable<TeamMember[]>).pipe(
                catchError(err => {
                    console.warn('Firestore Team Error:', err.message);
                    return of([]);
                })
            );
        });
    }

    async addMember(member: TeamMember) {
        return this.ngZone.run(async () => {
            return await addDoc(this.teamCollection, {
                ...member,
                createdAt: new Date()
            });
        });
    }

    async updateMember(id: string, member: Partial<TeamMember>) {
        const memberDoc = doc(this.firestore, `team/${id}`);
        return this.ngZone.run(async () => {
            return await updateDoc(memberDoc, member);
        });
    }

    async deleteMember(id: string) {
        const memberDoc = doc(this.firestore, `team/${id}`);
        return this.ngZone.run(async () => {
            return await deleteDoc(memberDoc);
        });
    }

    // Initialize with default members if empty
    async initializeDefaultTeam(members: TeamMember[] = this.defaultMembers) {
        for (const member of members) {
            const id = member.id || doc(this.teamCollection).id;
            await setDoc(doc(this.firestore, `team/${id}`), {
                ...member,
                id: id,
                createdAt: new Date()
            }, { merge: true });
        }
    }
}
