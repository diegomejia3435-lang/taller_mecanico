import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';
import { Toasts } from './components/toasts/toasts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Sidebar, Topbar, RouterOutlet, Toasts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
