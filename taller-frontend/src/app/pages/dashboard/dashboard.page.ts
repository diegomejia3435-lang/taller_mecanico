import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage {
  readonly dashboardService = inject(DashboardService);
  readonly authService = inject(AuthService);
}
