import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-quienes-somos',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './quienes-somos.html',
    styleUrls: ['./quienes-somos.css']
})
export class QuienesSomosComponent {
    // Component used for static presentation of identity, history, and values.
}
