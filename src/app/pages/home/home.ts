import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  private seoService = inject(SeoService);
  currentSlide = 0;
  slides = [
    {
      image: '/assets/images/about-image.png',
      title: 'Comunidad',
      desc: 'Fortaleciendo el tejido social Wayuu'
    },
    {
      image: '/assets/images/education.png',
      title: 'Educación',
      desc: 'Formando líderes para el mañana'
    },
    {
      image: '/assets/images/weaving.png',
      title: 'Tradición',
      desc: 'Preservando nuestra herencia cultural'
    }
  ];

  private intervalId: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.setSEO();

    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  private setSEO(): void {
    this.seoService.updateMetaTags({
      title: 'Inicio',
      description: 'Fundación Wopu Süpula Atüja (FWSA) - Organización sin ánimo de lucro dedicada al desarrollo integral de comunidades vulnerables en La Guajira mediante educación, emprendimiento y sostenibilidad.',
      keywords: 'FWSA, fundación La Guajira, desarrollo social Colombia, educación vulnerable, emprendimiento social, Wopu Süpula Atüja',
      ogUrl: 'https://www.fwsa.org.co/',
      ogImage: 'https://www.fwsa.org.co/assets/images/home-og.png'
    });

    // Agregar Schema de Organización
    this.seoService.generateOrganizationSchema();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.stopAutoSlide(); // Ensure no duplicate intervals
    this.intervalId = setInterval(() => {
      this.nextSlide();
      this.cdr.markForCheck(); // Explicitly mark for check
    }, 3000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.resetTimer();
  }

  setSlide(index: number) {
    this.currentSlide = index;
    this.resetTimer();
  }

  resetTimer() {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }
}
