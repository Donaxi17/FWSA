import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeoService } from '../../../services/seo.service';
import {
    TransparencyService, TransparencyDocument, formatFileSize, fileExtensionLabel
} from '../../../services/transparency.service';

@Component({
    selector: 'app-transparencia-documento',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './documento.html'
})
export class TransparenciaDocumentoComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly service = inject(TransparencyService);
    private readonly sanitizer = inject(DomSanitizer);
    private readonly seo = inject(SeoService);
    private readonly cdr = inject(ChangeDetectorRef);

    readonly formatFileSize = formatFileSize;
    readonly extLabel = fileExtensionLabel;

    state: 'loading' | 'ready' | 'error' = 'loading';
    errorMessage = '';
    progress = 0;

    document: TransparencyDocument | null = null;
    objectUrl: string | null = null;
    safeUrl: SafeResourceUrl | null = null;
    kind: 'pdf' | 'image' | 'other' = 'other';

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return this.fail('El enlace del documento no es válido.');

        try {
            const d = await this.service.getDocument(id);
            if (!d) return this.fail('Este documento no existe o fue retirado.');
            this.document = d;
            this.seo.updateMetaTags({
                title: `${d.title} | Transparencia`,
                description: d.description || `${d.category} ${d.year} - Fundación Wopu Süpula Atüja (FWSA).`,
                ogUrl: `https://funwsa.org/transparencia/documento/${id}`
            });

            if (d.source === 'link') {
                window.location.replace(d.fileUrl);
                return;
            }

            const file = await this.service.loadFile(d.fileId!, pct => {
                this.progress = pct;
                this.cdr.detectChanges();
            });
            this.objectUrl = URL.createObjectURL(file.blob);
            this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl);
            this.kind = file.type === 'application/pdf' ? 'pdf' : file.type.startsWith('image/') ? 'image' : 'other';
            this.state = 'ready';
            this.cdr.detectChanges();
        } catch (err: any) {
            console.warn('Error cargando documento:', err?.message || err);
            this.fail(err?.code === 'permission-denied'
                ? 'Este documento no está disponible públicamente.'
                : 'No pudimos cargar el documento. Revisa tu conexión e inténtalo de nuevo.');
        }
    }

    ngOnDestroy() {
        if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    }

    private fail(message: string) {
        this.state = 'error';
        this.errorMessage = message;
        this.cdr.detectChanges();
    }

    reload() {
        window.location.reload();
    }
}
