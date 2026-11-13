import { Component, OnDestroy, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SeoService } from '../../services/seo.service';
import {
    TransparencyService, TransparencyDocument, TRANSPARENCY_CATEGORIES,
    formatFileSize, fileExtensionLabel, documentHref
} from '../../services/transparency.service';

interface YearGroup {
    year: number;
    docs: TransparencyDocument[];
}

@Component({
    selector: 'app-transparencia',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './transparencia.html'
})
export class TransparenciaComponent implements OnInit, OnDestroy {
    private readonly service = inject(TransparencyService);
    private readonly seo = inject(SeoService);
    private readonly cdr = inject(ChangeDetectorRef);
    private sub?: Subscription;

    readonly formatFileSize = formatFileSize;
    readonly extLabel = fileExtensionLabel;
    readonly href = documentHref;

    documents: TransparencyDocument[] = [];
    loaded = false;

    search = '';
    selectedYear: number | null = null;
    selectedCategory: string | null = null;

    ngOnInit() {
        this.seo.updateMetaTags({
            title: 'Transparencia',
            description: 'Documentos públicos de la Fundación Wopu Süpula Atüja (FWSA): estados financieros, informes de gestión, actas, estatutos y certificados.',
            keywords: 'FWSA transparencia, estados financieros fundación, informe de gestión, régimen tributario especial, ESAL La Guajira',
            ogUrl: 'https://funwsa.org/transparencia'
        });

        this.sub = this.service.getPublishedDocuments().subscribe(docs => {
            this.documents = docs;
            this.loaded = true;
            this.cdr.detectChanges();
        });
    }

    ngOnDestroy() {
        this.sub?.unsubscribe();
    }

    get years(): number[] {
        return [...new Set(this.documents.map(d => d.year).filter(Boolean))].sort((a, b) => b - a);
    }

    /** Solo categorías que tienen al menos un documento, en el orden oficial. */
    get categories(): string[] {
        const used = new Set(this.documents.map(d => d.category));
        return TRANSPARENCY_CATEGORIES.filter(c => used.has(c));
    }

    get filtered(): TransparencyDocument[] {
        const term = this.normalize(this.search.trim());
        return this.documents.filter(d =>
            (this.selectedYear === null || d.year === this.selectedYear) &&
            (this.selectedCategory === null || d.category === this.selectedCategory) &&
            (!term || this.normalize(`${d.title} ${d.description || ''} ${d.category}`).includes(term))
        );
    }

    get groups(): YearGroup[] {
        const map = new Map<number, TransparencyDocument[]>();
        for (const d of this.filtered) {
            if (!map.has(d.year)) map.set(d.year, []);
            map.get(d.year)!.push(d);
        }
        return [...map.entries()]
            .sort((a, b) => b[0] - a[0])
            .map(([year, docs]) => ({ year, docs }));
    }

    get hasFilters(): boolean {
        return !!this.search.trim() || this.selectedYear !== null || this.selectedCategory !== null;
    }

    selectYear(year: number | null) {
        this.selectedYear = year;
    }

    selectCategory(cat: string | null) {
        this.selectedCategory = cat;
    }

    clearFilters() {
        this.search = '';
        this.selectedYear = null;
        this.selectedCategory = null;
    }

    trackByYear(_: number, g: YearGroup) {
        return g.year;
    }

    trackById(_: number, d: TransparencyDocument) {
        return d.id;
    }

    private normalize(s: string): string {
        return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }
}
