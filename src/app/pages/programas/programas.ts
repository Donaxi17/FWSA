import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-programas',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './programas.html',
    styleUrls: ['./programas.css']
})
export class ProgramasComponent {
    programas = [
        {
            id: 1,
            title: 'Educación Integral',
            badge: 'Educación',
            description: 'Formación de niños, jóvenes y adultos en habilidades para la vida y el desarrollo humano.',
            icon: 'fa-book-open',
            color: 'primary',
            image: '/assets/images/programas/educacion.jpg'
        },
        {
            id: 2,
            title: 'Sostenibilidad Ambiental',
            badge: 'Ambiente',
            description: 'Promovemos el cuidado del entorno y la gestión responsable de recursos naturales en comunidades.',
            icon: 'fa-leaf',
            color: 'green-600',
            image: '/assets/images/programas/ambiente.jpg'
        },
        {
            id: 3,
            title: 'Emprendimiento Social',
            badge: 'Economía',
            description: 'Apoyo a iniciativas locales que generen desarrollo económico y bienestar comunitario.',
            icon: 'fa-rocket',
            color: 'orange-500',
            image: '/assets/images/programas/emprendimiento.jpg'
        }
    ];
}
