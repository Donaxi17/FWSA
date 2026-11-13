import { Component, EventEmitter, Output, inject, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
    TransparencyService, TransparencyDocument, TransparencyCategory,
    TRANSPARENCY_CATEGORIES, MAX_TRANSPARENCY_FILE_MB, ALLOWED_TRANSPARENCY_EXTENSIONS,
    formatFileSize, fileExtensionLabel, documentHref
} from '../../../../services/transparency.service';

type FormModel = Omit<TransparencyDocument, 'year'> & { year: number | null };

@Component({
    selector: 'app-transparency-admin',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './transparency-admin.html'
})
export class TransparencyAdminComponent implements OnDestroy {
    @Output() notify = new EventEmitter<{ message: string; type: 'success' | 'error' }>();

    private readonly service = inject(TransparencyService);
    private readonly cdr = inject(ChangeDetectorRef);
    private sub?: Subscription;

    readonly categories = TRANSPARENCY_CATEGORIES;
    readonly maxMb = MAX_TRANSPARENCY_FILE_MB;
    readonly accept = ALLOWED_TRANSPARENCY_EXTENSIONS.map(e => '.' + e).join(',');
    readonly currentYear = new Date().getFullYear();
    readonly formatFileSize = formatFileSize;
    readonly extLabel = fileExtensionLabel;
    readonly href = documentHref;

    documents: TransparencyDocument[] = [];
    loaded = false;
    loadError = '';

    // Filtros
    search = '';
    filterCategory: '' | TransparencyCategory = '';
    filterYear: '' | number = '';

    // Formulario
    isFormOpen = false;
    editingId: string | null = null;
    form: FormModel = this.emptyForm();
    selectedFile: File | null = null;
    fileError = '';
    isDragging = false;
    isSaving = false;
    uploadProgress = 0;
    submitted = false;

    // Confirmación de borrado
    pendingDelete: TransparencyDocument | null = null;
    isDeleting = false;

    constructor() {
        this.load();
    }

    load() {
        this.sub?.unsubscribe();
        this.loaded = false;
        this.loadError = '';
        this.sub = this.service.getDocuments().subscribe({
            next: docs => {
                this.documents = docs;
                this.loaded = true;
                this.loadError = '';
                this.cdr.detectChanges();
            },
            error: err => {
                console.warn('Firestore Transparency Error:', err?.message || err);
                this.loaded = true;
                this.loadError = err?.code === 'permission-denied'
                    ? 'Firebase no dio permiso para leer los documentos. Revisa las reglas de Firestore.'
                    : 'No se pudieron cargar los documentos. Revisa tu conexión.';
                this.cdr.detectChanges();
            }
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    @HostListener('document:keydown.escape')
    onEscape() {
        if (this.pendingDelete && !this.isDeleting) this.pendingDelete = null;
    }

    // ---------- Listado ----------

    get years(): number[] {
        return [...new Set(this.documents.map(d => d.year).filter(Boolean))].sort((a, b) => b - a);
    }

    get filtered(): TransparencyDocument[] {
        const term = this.search.trim().toLowerCase();
        return this.documents.filter(d =>
            (!this.filterCategory || d.category === this.filterCategory) &&
            (!this.filterYear || d.year === Number(this.filterYear)) &&
            (!term || d.title.toLowerCase().includes(term) || (d.description || '').toLowerCase().includes(term))
        );
    }

    get publishedCount() {
        return this.documents.filter(d => d.published !== false).length;
    }

    get hasFilters() {
        return !!(this.search || this.filterCategory || this.filterYear);
    }

    clearFilters() {
        this.search = '';
        this.filterCategory = '';
        this.filterYear = '';
    }

    trackById(_: number, d: TransparencyDocument) {
        return d.id;
    }

    async togglePublished(d: TransparencyDocument) {
        const next = d.published === false;
        try {
            await this.service.setPublished(d, next);
            this.notify.emit({ message: next ? 'Documento publicado en la página.' : 'Documento ocultado de la página.', type: 'success' });
        } catch {
            this.notify.emit({ message: 'No se pudo cambiar la visibilidad.', type: 'error' });
        }
    }

    // ---------- Formulario ----------

    private emptyForm(): FormModel {
        return {
            title: '',
            description: '',
            category: 'Estados Financieros',
            year: new Date().getFullYear(),
            fileUrl: '',
            source: 'upload',
            fileId: null,
            fileName: null,
            fileSize: null,
            fileType: null,
            published: true
        };
    }

    openCreate() {
        this.editingId = null;
        this.form = this.emptyForm();
        this.resetFileState();
        this.submitted = false;
        this.isFormOpen = true;
    }

    openEdit(d: TransparencyDocument) {
        this.editingId = d.id!;
        this.form = { ...this.emptyForm(), ...d, published: d.published !== false };
        this.resetFileState();
        this.submitted = false;
        this.isFormOpen = true;
    }

    closeForm() {
        if (this.isSaving) return;
        this.isFormOpen = false;
        this.editingId = null;
    }

    private resetFileState() {
        this.selectedFile = null;
        this.fileError = '';
        this.isDragging = false;
        this.uploadProgress = 0;
    }

    setSource(source: 'upload' | 'link') {
        this.form.source = source;
        this.fileError = '';
    }

    onFileInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) this.pickFile(file);
        input.value = '';
    }

    onDragOver(e: DragEvent) {
        e.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(e: DragEvent) {
        e.preventDefault();
        this.isDragging = false;
    }

    onDrop(e: DragEvent) {
        e.preventDefault();
        this.isDragging = false;
        const file = e.dataTransfer?.files?.[0];
        if (file) this.pickFile(file);
    }

    private pickFile(file: File) {
        const error = this.service.validateFile(file);
        if (error) {
            this.fileError = error;
            this.selectedFile = null;
            return;
        }
        this.fileError = '';
        this.selectedFile = file;
        // Sugerir el título a partir del nombre si está vacío
        if (!this.form.title.trim()) {
            this.form.title = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim();
        }
    }

    removeSelectedFile() {
        this.selectedFile = null;
    }

    get hasExistingUpload(): boolean {
        return this.form.source === 'upload' && !!this.form.fileId;
    }

    get titleInvalid() {
        return this.submitted && !this.form.title.trim();
    }

    get yearInvalid() {
        const y = Number(this.form.year);
        return this.submitted && (!y || y < 1990 || y > this.currentYear + 1);
    }

    get linkInvalid() {
        return this.submitted && this.form.source === 'link' && !/^https?:\/\/\S+$/i.test(this.form.fileUrl.trim());
    }

    get fileMissing() {
        return this.submitted && this.form.source === 'upload' && !this.selectedFile && !this.hasExistingUpload;
    }

    async save() {
        this.submitted = true;
        if (this.titleInvalid || this.yearInvalid || this.linkInvalid || this.fileMissing || this.fileError) {
            this.notify.emit({ message: 'Revisa los campos marcados en rojo.', type: 'error' });
            return;
        }

        this.isSaving = true;
        this.uploadProgress = 0;
        this.cdr.detectChanges();

        const original = this.editingId ? this.documents.find(d => d.id === this.editingId) : undefined;
        let uploadedFileId: string | null = null;

        try {
            const data: TransparencyDocument = {
                title: this.form.title.trim(),
                description: (this.form.description || '').trim(),
                category: this.form.category,
                year: Number(this.form.year),
                published: this.form.published,
                source: this.form.source,
                fileUrl: this.form.source === 'link' ? this.form.fileUrl.trim() : '',
                fileId: this.form.fileId ?? null,
                fileName: this.form.fileName ?? null,
                fileSize: this.form.fileSize ?? null,
                fileType: this.form.fileType ?? null
            };

            if (this.form.source === 'upload' && this.selectedFile) {
                const res = await this.service.uploadFile(this.selectedFile, data.published, pct => {
                    this.uploadProgress = pct;
                    this.cdr.detectChanges();
                });
                uploadedFileId = res.fileId;
                Object.assign(data, { fileId: res.fileId, fileName: res.name, fileSize: res.size, fileType: res.type });
            } else if (this.form.source === 'link') {
                Object.assign(data, { fileId: null, fileName: null, fileSize: null, fileType: null });
            }

            if (this.editingId) {
                await this.service.updateDocument(this.editingId, data);
            } else {
                await this.service.addDocument(data);
            }

            // Mantener la visibilidad del archivo sincronizada con la del documento
            if (data.source === 'upload' && !uploadedFileId && original?.published !== data.published) {
                await this.service.setFilePublished(data.fileId, data.published);
            }

            // Si se reemplazó el archivo o se cambió a enlace, borrar el archivo anterior
            if (original?.source === 'upload' && original.fileId && original.fileId !== data.fileId) {
                await this.service.deleteFile(original.fileId);
            }

            this.notify.emit({ message: this.editingId ? 'Documento actualizado.' : 'Documento creado.', type: 'success' });
            this.isSaving = false;
            this.isFormOpen = false;
            this.editingId = null;
        } catch (err: any) {
            console.error('Error guardando documento de transparencia:', err);
            // Si el archivo se guardó pero falló el registro, limpiar el archivo huérfano
            if (uploadedFileId) await this.service.deleteFile(uploadedFileId);
            const code: string = err?.code || '';
            let message = 'No se pudo guardar el documento. Revisa tu conexión e inténtalo de nuevo.';
            if (code === 'permission-denied') {
                message = err?.stage === 'archivo'
                    ? 'Firebase no dio permiso para guardar el archivo. Falta la regla de "transparency_files" en Firestore.'
                    : 'Firebase no dio permiso para guardar la ficha. Revisa la regla de "transparency_documents" en Firestore.';
            } else if (code === 'resource-exhausted') {
                message = 'Se alcanzó el límite gratuito de Firebase por hoy. Inténtalo mañana.';
            }
            this.notify.emit({ message, type: 'error' });
            this.isSaving = false;
        } finally {
            this.cdr.detectChanges();
        }
    }

    // ---------- Borrado ----------

    askDelete(d: TransparencyDocument) {
        this.pendingDelete = d;
    }

    async confirmDelete() {
        if (!this.pendingDelete) return;
        this.isDeleting = true;
        this.cdr.detectChanges();
        try {
            await this.service.deleteDocument(this.pendingDelete);
            this.notify.emit({ message: 'Documento eliminado.', type: 'success' });
            this.pendingDelete = null;
        } catch {
            this.notify.emit({ message: 'No se pudo eliminar el documento.', type: 'error' });
        } finally {
            this.isDeleting = false;
            this.cdr.detectChanges();
        }
    }

    formatDate(value: any): string {
        if (!value) return '';
        const date: Date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}
