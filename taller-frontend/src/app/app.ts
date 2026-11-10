import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Encabezado } from './components/encabezado/encabezado';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Encabezado, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
