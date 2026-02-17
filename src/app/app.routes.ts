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

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'quienes-somos', component: QuienesSomosComponent },
    { path: 'equipo', component: EquipoComponent },
    { path: 'unete', component: JoinUsComponent },
    { path: 'unete/postular/:id', component: PostulacionComponent },
    { path: 'programas', component: ProgramasComponent },
    { path: 'impacto', component: ImpactoComponent },
    { path: 'donar', component: Donar },
    { path: 'contacto', component: ContactoComponent },
    { path: 'admin', loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent) },
    { path: '**', redirectTo: '' } // Wildcard route for 404
];
