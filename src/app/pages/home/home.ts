import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy {
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
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
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
