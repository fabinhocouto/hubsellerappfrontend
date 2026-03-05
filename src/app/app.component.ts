import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { LoadingService } from './services/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  showMenu: boolean = true; // Controla a exibição do menu

  @ViewChild('sidenav') sidenav!: MatSidenav; // Corrige erro de inicialização

  loading$: Observable<boolean>;

  constructor(private router: Router,private authService: AuthService, private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }

  ngAfterViewInit() {
    // Observa as mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const navEvent = event as NavigationEnd; // Garante que é NavigationEnd
        this.showMenu = !navEvent.urlAfterRedirects.startsWith('/login');
      });
  }

  toggleMenu() {
    if (this.sidenav) {
      this.sidenav.toggle(); // Método correto do MatSidenav
    }
  }
  logout() {
    this.authService.setToken("");
    this.router.navigate(['/login']);
  }
}
