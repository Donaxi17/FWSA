import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SEOData {
    title: string;
    description: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private meta = inject(Meta);
    private titleService = inject(Title);

    // Datos base de la organización
    private baseUrl = 'https://www.fwsa.org.co'; // Actualizar con tu dominio real
    private defaultImage = '/assets/images/og-image.png'; // Imagen por defecto para compartir
    private siteName = 'Fundación Wopu Süpula Atüja (FWSA)';

    updateMetaTags(data: SEOData): void {
        // Título de la página
        const fullTitle = `${data.title} | ${this.siteName}`;
        this.titleService.setTitle(fullTitle);

        // Meta descripción
        this.meta.updateTag({ name: 'description', content: data.description });

        // Keywords (opcional, Google no las usa pero otros buscadores sí)
        if (data.keywords) {
            this.meta.updateTag({ name: 'keywords', content: data.keywords });
        }

        // Meta tags de robots
        this.meta.updateTag({ name: 'robots', content: 'index, follow' });
        this.meta.updateTag({ name: 'author', content: this.siteName });

        // Open Graph para Facebook, LinkedIn, etc.
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
        this.meta.updateTag({ property: 'og:title', content: data.ogTitle || fullTitle });
        this.meta.updateTag({ property: 'og:description', content: data.ogDescription || data.description });
        this.meta.updateTag({ property: 'og:image', content: data.ogImage || this.defaultImage });
        this.meta.updateTag({ property: 'og:url', content: data.ogUrl || this.baseUrl });
        this.meta.updateTag({ property: 'og:locale', content: 'es_CO' });

        // Twitter Cards
        this.meta.updateTag({ name: 'twitter:card', content: data.twitterCard || 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: data.twitterTitle || fullTitle });
        this.meta.updateTag({ name: 'twitter:description', content: data.twitterDescription || data.description });
        this.meta.updateTag({ name: 'twitter:image', content: data.twitterImage || data.ogImage || this.defaultImage });

        // Canonical URL
        this.updateCanonical(data.ogUrl || this.baseUrl);
    }

    // Actualizar URL canónica
    private updateCanonical(url: string): void {
        let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');

        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }

        link.setAttribute('href', url);
    }

    // Método para generar JSON-LD Schema (schema.org)
    generateOrganizationSchema(): void {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'NGO',
            'name': 'Fundación Wopu Süpula Atüja',
            'alternateName': 'FWSA',
            'url': this.baseUrl,
            'logo': `${this.baseUrl}/assets/images/logo.png`,
            'description': 'Organización social sin ánimo de lucro dedicada al desarrollo integral de comunidades vulnerables en La Guajira, Colombia.',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': 'La Guajira',
                'addressCountry': 'CO'
            },
            'contactPoint': {
                '@type': 'ContactPoint',
                'telephone': '+57-300-525-1713',
                'contactType': 'customer service',
                'email': 'contacto@fwsa.org.co',
                'availableLanguage': 'Spanish'
            },
            'sameAs': [
                'https://www.facebook.com/FWSA',
                'https://www.instagram.com/FWSA',
                'https://www.linkedin.com/company/FWSA'
            ],
            'founder': {
                '@type': 'Person',
                'name': 'Fundadores FWSA'
            },
            'areaServed': {
                '@type': 'Place',
                'name': 'La Guajira, Colombia'
            }
        };

        this.insertJsonLd(schema, 'organization-schema');
    }

    // Insertar JSON-LD en el documento
    private insertJsonLd(schema: any, id: string): void {
        let script = document.getElementById(id) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = id;
            document.head.appendChild(script);
        }

        script.textContent = JSON.stringify(schema);
    }
}
