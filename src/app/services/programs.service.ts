import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc, CollectionReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Program {
    id?: string;
    title: string;
    description: string;
    category: string;
    status: 'Activo' | 'Finalizado';
    image: string;
    createdAt?: any;
}

@Injectable({
    providedIn: 'root'
})
export class ProgramsService {
    private readonly firestore = inject(Firestore);
    private readonly ngZone = inject(NgZone);
    private readonly programsCollection: CollectionReference;

    constructor() {
        this.programsCollection = collection(this.firestore, 'programs');
    }

    getPrograms(): Observable<Program[]> {
        return (collectionData(this.programsCollection, { idField: 'id' }) as Observable<Program[]>).pipe(
            catchError(err => {
                console.warn('Firestore Permission Warning:', err.message);
                return of([]);
            })
        );
    }

    /**
     * uploadImage Turbo: Usa ObjectURL y compresión optimizada
     * para que el guardado sea casi instantáneo.
     */
    async uploadImage(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            // Usamos createObjectURL que es mucho más rápido que FileReader
            const tempUrl = URL.createObjectURL(file);
            const img = new Image();

            img.onload = () => {
                this.ngZone.run(() => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 600; // Tamaño ideal para carga ultrarrápida
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, width, height);
                    }

                    // Calidad 0.5: El equilibrio perfecto entre nitidez y peso pluma
                    const result = canvas.toDataURL('image/jpeg', 0.5);
                    URL.revokeObjectURL(tempUrl); // Limpiamos memoria
                    resolve(result);
                });
            };

            img.onerror = () => {
                URL.revokeObjectURL(tempUrl);
                this.ngZone.run(() => reject('Error al procesar la imagen.'));
            };

            img.src = tempUrl;
        });
    }

    async addProgram(program: Program) {
        return this.ngZone.run(async () => {
            return await addDoc(this.programsCollection, {
                ...program,
                createdAt: new Date()
            });
        });
    }

    async updateProgram(id: string, program: Partial<Program>) {
        const programDoc = doc(this.firestore, `programs/${id}`);
        return this.ngZone.run(async () => {
            return await updateDoc(programDoc, program);
        });
    }

    async deleteProgram(id: string) {
        const programDoc = doc(this.firestore, `programs/${id}`);
        return this.ngZone.run(async () => {
            return await deleteDoc(programDoc);
        });
    }
}
