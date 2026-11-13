import { Injectable, inject, NgZone } from '@angular/core';
import {
    Firestore, collection, collectionData, doc, getDoc, getDocs, setDoc,
    addDoc, updateDoc, deleteDoc, query, orderBy, where,
    CollectionReference
} from '@angular/fire/firestore';
import { Observable, of, timer, MonoTypeOperatorFunction } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

export const TRANSPARENCY_CATEGORIES = [
    'Estados Financieros',
    'Informe de Gestión',
    'Actas de Asamblea',
    'Estatutos',
    'Certificados',
    'Declaración de Renta',
    'Régimen Tributario Especial',
    'Otros'
] as const;

export type TransparencyCategory = typeof TRANSPARENCY_CATEGORIES[number];

export interface TransparencyDocument {
    id?: string;
    title: string;
    description: string;
    category: TransparencyCategory;
    year: number;
    /** 'upload' = archivo guardado en Firestore por partes, 'link' = enlace externo (Drive, etc.) */
    source: 'upload' | 'link';
    /** Solo para 'link': URL externa */
    fileUrl: string;
    /** Solo para 'upload': id en la colección transparency_files */
    fileId?: string | null;
    fileName?: string | null;
    fileSize?: number | null;
    fileType?: string | null;
    published: boolean;
    createdAt?: any;
    updatedAt?: any;
}

export interface UploadResult {
    fileId: string;
    name: string;
    size: number;
    type: string;
}

export interface LoadedFile {
    blob: Blob;
    name: string;
    type: string;
    size: number;
}

/**
 * Los archivos se guardan en Firestore partidos en trozos (cada documento de Firestore
 * admite máximo 1 MiB). 600 KB de binario ≈ 800 KB en base64, con margen de sobra.
 */
const CHUNK_BYTES = 600 * 1024;

export const MAX_TRANSPARENCY_FILE_MB = 10;

export const ALLOWED_TRANSPARENCY_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png'];

const FILES = 'transparency_files';
const DOCS = 'transparency_documents';

@Injectable({
    providedIn: 'root'
})
export class TransparencyService {
    private readonly firestore = inject(Firestore);
    private readonly ngZone = inject(NgZone);
    private readonly docsCollection: CollectionReference;

    constructor() {
        this.docsCollection = collection(this.firestore, DOCS);
    }

    // ------------------------------------------------------------------ lectura

    /**
     * Todos los documentos (panel admin), más recientes primero.
     * Reintenta sola 3 veces y, si sigue fallando, deja pasar el error para que
     * el panel lo muestre con un botón "Reintentar" (antes la lista quedaba congelada).
     */
    getDocuments(): Observable<TransparencyDocument[]> {
        const q = query(this.docsCollection, orderBy('createdAt', 'desc'));
        return (collectionData(q, { idField: 'id' }) as Observable<TransparencyDocument[]>).pipe(
            retry({ count: 3, delay: (_err, attempt) => timer(attempt * 2000) }),
            runInZone(this.ngZone)
        );
    }

    /** Solo publicados. El filtro va en la consulta: el público nunca recibe documentos ocultos. */
    getPublishedDocuments(): Observable<TransparencyDocument[]> {
        const q = query(this.docsCollection, where('published', '==', true));
        return (collectionData(q, { idField: 'id' }) as Observable<TransparencyDocument[]>).pipe(
            map(docs => docs.sort((a, b) =>
                (b.year || 0) - (a.year || 0) || millis(b.createdAt) - millis(a.createdAt))),
            catchError(err => {
                console.warn('Firestore Transparency Error:', err.message);
                return of([]);
            }),
            runInZone(this.ngZone)
        );
    }

    async getDocument(id: string): Promise<TransparencyDocument | null> {
        const snap = await this.ngZone.run(() => getDoc(doc(this.firestore, `${DOCS}/${id}`)));
        return snap.exists() ? { id: snap.id, ...(snap.data() as TransparencyDocument) } : null;
    }

    /** Descarga los trozos y arma el archivo original. */
    async loadFile(fileId: string, onProgress?: (pct: number) => void): Promise<LoadedFile> {
        const metaSnap = await this.ngZone.run(() => getDoc(doc(this.firestore, `${FILES}/${fileId}`)));
        if (!metaSnap.exists()) throw { code: 'not-found', message: 'Archivo no encontrado' };
        const meta = metaSnap.data() as { name: string; type: string; size: number; chunkCount: number };

        const chunksSnap = await this.ngZone.run(() =>
            getDocs(query(collection(this.firestore, `${FILES}/${fileId}/chunks`), orderBy('index'))));
        if (chunksSnap.size !== meta.chunkCount) {
            throw { code: 'data-loss', message: 'El archivo está incompleto' };
        }

        const parts: Uint8Array[] = [];
        chunksSnap.docs.forEach((d, i) => {
            parts.push(base64ToBytes(d.data()['data'] as string));
            onProgress?.(Math.round(((i + 1) / meta.chunkCount) * 100));
        });

        return {
            blob: new Blob(parts as BlobPart[], { type: meta.type || 'application/octet-stream' }),
            name: meta.name,
            type: meta.type,
            size: meta.size
        };
    }

    // ------------------------------------------------------------------ archivos

    /** Valida extensión y tamaño. Devuelve un mensaje de error o null si es válido. */
    validateFile(file: File): string | null {
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        if (!ALLOWED_TRANSPARENCY_EXTENSIONS.includes(ext)) {
            return `Formato no permitido (.${ext}). Usa PDF, Word, Excel, PowerPoint o imagen.`;
        }
        if (file.size === 0) {
            return 'El archivo está vacío.';
        }
        if (file.size > MAX_TRANSPARENCY_FILE_MB * 1024 * 1024) {
            return `El archivo pesa más de ${MAX_TRANSPARENCY_FILE_MB} MB. Comprímelo o usa "Enlace externo".`;
        }
        return null;
    }

    /**
     * Guarda el archivo en Firestore por trozos, reportando el progreso (0-100).
     * Los trozos se escriben primero y el registro principal al final, así un archivo
     * a medio subir nunca aparece como válido.
     */
    async uploadFile(file: File, published: boolean, onProgress: (pct: number) => void): Promise<UploadResult> {
        const fileRef = doc(collection(this.firestore, FILES));
        const fileId = fileRef.id;
        const total = Math.max(1, Math.ceil(file.size / CHUNK_BYTES));

        try {
            for (let i = 0; i < total; i++) {
                const slice = file.slice(i * CHUNK_BYTES, (i + 1) * CHUNK_BYTES);
                const data = await blobToBase64(slice);
                await this.ngZone.run(() =>
                    setDoc(doc(this.firestore, `${FILES}/${fileId}/chunks/${pad(i)}`), { index: i, data }));
                this.ngZone.run(() => onProgress(Math.round(((i + 1) / total) * 100)));
            }
            await this.ngZone.run(() => setDoc(fileRef, {
                name: file.name,
                type: file.type || guessMime(file.name),
                size: file.size,
                chunkCount: total,
                published,
                createdAt: new Date()
            }));
        } catch (err: any) {
            console.error(`[Transparencia] Falló al guardar el archivo en ${FILES}/${fileId}:`, err?.code, err?.message);
            await this.deleteFile(fileId, total);
            if (err && typeof err === 'object') err.stage = 'archivo';
            throw err;
        }

        return { fileId, name: file.name, size: file.size, type: file.type || guessMime(file.name) };
    }

    /** Mantiene la visibilidad del archivo igual a la del documento (lo usan las reglas de Firestore). */
    async setFilePublished(fileId: string | null | undefined, published: boolean) {
        if (!fileId) return;
        await this.ngZone.run(() => updateDoc(doc(this.firestore, `${FILES}/${fileId}`), { published }));
    }

    /** Borra el archivo y todos sus trozos. Ignora lo que ya no exista. */
    async deleteFile(fileId: string | null | undefined, knownChunkCount?: number): Promise<void> {
        if (!fileId) return;
        try {
            const snap = await this.ngZone.run(() => getDocs(collection(this.firestore, `${FILES}/${fileId}/chunks`)));
            const ids = new Set(snap.docs.map(d => d.id));
            for (let i = 0; i < (knownChunkCount || 0); i++) ids.add(pad(i));
            await Promise.all([...ids].map(id =>
                this.ngZone.run(() => deleteDoc(doc(this.firestore, `${FILES}/${fileId}/chunks/${id}`)))));
            await this.ngZone.run(() => deleteDoc(doc(this.firestore, `${FILES}/${fileId}`)));
        } catch (err: any) {
            console.warn('No se pudo borrar el archivo:', err?.message || err);
        }
    }

    // ------------------------------------------------------------------ documentos

    async addDocument(data: TransparencyDocument) {
        return this.ngZone.run(() => addDoc(this.docsCollection, {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
    }

    async updateDocument(id: string, data: Partial<TransparencyDocument>) {
        const { id: _omit, createdAt: _c, ...rest } = data;
        return this.ngZone.run(() => updateDoc(doc(this.firestore, `${DOCS}/${id}`), {
            ...rest,
            updatedAt: new Date()
        }));
    }

    async setPublished(d: TransparencyDocument, published: boolean) {
        await this.updateDocument(d.id!, { published });
        if (d.source === 'upload') await this.setFilePublished(d.fileId, published);
    }

    async deleteDocument(document: TransparencyDocument) {
        if (!document.id) return;
        await this.ngZone.run(() => deleteDoc(doc(this.firestore, `${DOCS}/${document.id}`)));
        if (document.source === 'upload') {
            await this.deleteFile(document.fileId);
        }
    }
}

// ---------------------------------------------------------------------- utilidades

/**
 * Firebase emite sus datos fuera de la zona de Angular. Si la lista se dibuja ahí,
 * los botones quedan "desconectados": al hacer clic cambia el estado pero la pantalla
 * no se actualiza (era el fallo de Editar/Eliminar). Esto devuelve cada emisión a la zona.
 */
export function runInZone<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
    return source => new Observable<T>(subscriber => source.subscribe({
        next: value => zone.run(() => subscriber.next(value)),
        error: err => zone.run(() => subscriber.error(err)),
        complete: () => zone.run(() => subscriber.complete())
    }));
}

/** Enlace para ver un documento: el visor interno para archivos subidos, o el enlace externo. */
export function documentHref(d: TransparencyDocument): string {
    return d.source === 'link' ? d.fileUrl : `/transparencia/documento/${d.id}`;
}

/** Formatea bytes a texto legible (ej. 1.2 MB). */
export function formatFileSize(bytes?: number | null): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Devuelve la extensión en mayúsculas para la etiqueta del tipo de archivo. */
export function fileExtensionLabel(d: Pick<TransparencyDocument, 'fileName' | 'source'>): string {
    const name = d.fileName || '';
    const ext = name.includes('.') ? name.split('.').pop()!.toUpperCase() : '';
    if (ext) return ext === 'JPEG' ? 'JPG' : ext;
    return d.source === 'link' ? 'ENLACE' : 'DOC';
}

function millis(value: any): number {
    if (!value) return 0;
    if (typeof value.toMillis === 'function') return value.toMillis();
    const t = new Date(value).getTime();
    return isNaN(t) ? 0 : t;
}

function pad(i: number): string {
    return String(i).padStart(4, '0');
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.substring(result.indexOf(',') + 1));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}

function base64ToBytes(b64: string): Uint8Array {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
}

function guessMime(name: string): string {
    const ext = (name.split('.').pop() || '').toLowerCase();
    const map: Record<string, string> = {
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ppt: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png'
    };
    return map[ext] || 'application/octet-stream';
}
