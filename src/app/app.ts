import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { SeoService, SEOData } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fwsa-app');
  public isAdminRoute = false;
  private router = inject(Router);
  private seo = inject(SeoService);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdminRoute = event.url.includes('/admin');
      this.applyRouteSeo();
    });
  }

  /** Aplica el título/descripción definidos en `data.seo` de la ruta activa (ver app.routes.ts). */
  private applyRouteSeo() {
    let snapshot: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    while (snapshot?.firstChild) snapshot = snapshot.firstChild;
    const data = snapshot?.data?.['seo'] as SEOData | undefined;
    if (data) this.seo.updateMetaTags(data);
  }
}
