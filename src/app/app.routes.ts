import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { QuienesSomosComponent } from './pages/quienes-somos/quienes-somos';
import { ContactoComponent } from './pages/contacto/contacto';
import { ProgramasComponent } from './pages/programas/programas';
import { EquipoComponent } from './pages/equipo/equipo';
import { ImpactoComponent } from './pages/impacto/impacto';
import { Donar } from './pages/donar/donar';
import { JoinUsComponent } from './pages/join-us/join-us';
import { PostulacionComponent } from './pages/join-us/postulacion/postulacion';
import { TransparenciaComponent } from './pages/transparencia/transparencia';
import { SEOData } from './services/seo.service';

/**
 * `data.seo` define el título y la descripción de cada página; App los aplica al navegar.
 * Las páginas que no lo tienen (Inicio, Transparencia y el visor de documentos)
 * ponen sus propias etiquetas desde el componente.
 */
const seo = (title: string, description: string, path: string, extra: Partial<SEOData> = {}): { seo: SEOData } => ({
    seo: { title, description, ogUrl: `https://funwsa.org${path}`, ...extra }
});

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'quienes-somos', component: QuienesSomosComponent,
        data: seo('Quiénes Somos', 'Conoce la historia, misión, visión y valores de la Fundación Wopu Süpula Atüja (FWSA), organización sin ánimo de lucro de La Guajira.', '/quienes-somos')
    },
    {
        path: 'equipo', component: EquipoComponent,
        data: seo('Nuestro Equipo', 'Las personas que dirigen la Fundación Wopu Süpula Atüja (FWSA) y trabajan por las comunidades de La Guajira.', '/equipo')
    },
    {
        path: 'unete', component: JoinUsComponent,
        data: seo('Únete', 'Vacantes y oportunidades de voluntariado en la Fundación Wopu Süpula Atüja (FWSA). Súmate al cambio en La Guajira.', '/unete')
    },
    {
        path: 'unete/postular/:id', component: PostulacionComponent,
        data: seo('Postulación', 'Envía tu postulación a una vacante de la Fundación Wopu Süpula Atüja (FWSA).', '/unete', { robots: 'noindex, follow' })
    },
    {
        path: 'programas', component: ProgramasComponent,
        data: seo('Programas', 'Programas de educación, salud, desarrollo social y sostenibilidad de la Fundación Wopu Süpula Atüja (FWSA) en La Guajira.', '/programas')
    },
    {
        path: 'impacto', component: ImpactoComponent,
        data: seo('Impacto Social', 'La población con la que trabaja la Fundación Wopu Süpula Atüja (FWSA) y el impacto de sus acciones en La Guajira.', '/impacto')
    },
    { path: 'transparencia', component: TransparenciaComponent },
    { path: 'transparencia/documento/:id', loadComponent: () => import('./pages/transparencia/documento/documento').then(m => m.TransparenciaDocumentoComponent) },
    {
        path: 'donar', component: Donar,
        data: seo('Donar', 'Apoya a la Fundación Wopu Süpula Atüja (FWSA) con una donación por transferencia bancaria y transforma vidas en La Guajira.', '/donar')
    },
    {
        path: 'contacto', component: ContactoComponent,
        data: seo('Contacto', 'Escríbenos o llámanos: contactofwsa@gmail.com · +57 311 495 2911. Fundación Wopu Süpula Atüja (FWSA), La Guajira.', '/contacto')
    },
    {
        path: 'admin', loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
        data: seo('Panel de administración', 'Panel de administración de la Fundación Wopu Süpula Atüja (FWSA).', '/admin', { robots: 'noindex, nofollow' })
    },
    { path: '**', redirectTo: '' } // Wildcard route for 404
];
