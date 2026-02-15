import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { QuienesSomosComponent } from './pages/quienes-somos/quienes-somos';
import { ContactoComponent } from './pages/contacto/contacto';
import { ProgramasComponent } from './pages/programas/programas';
import { EquipoComponent } from './pages/equipo/equipo';
import { ImpactoComponent } from './pages/impacto/impacto';
import { Donar } from './pages/donar/donar';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'quienes-somos', component: QuienesSomosComponent },
    { path: 'equipo', component: EquipoComponent },
    { path: 'programas', component: ProgramasComponent },
    { path: 'impacto', component: ImpactoComponent },
    { path: 'donar', component: Donar },
    { path: 'contacto', component: ContactoComponent },
    { path: '**', redirectTo: '' } // Wildcard route for 404
];
