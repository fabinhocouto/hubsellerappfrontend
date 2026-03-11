import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from './models/usuario.model';


interface AuthResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'authToken';
  private usuarioKey = 'authUsuario';

  private apiUrlLogin = environment.apiUrl + '/hubsellerapp-backend/autenticacao/login';

  private usuarioLogado!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrlLogin, { username, password });
  }

  logout(): void {

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usuarioKey);

    this.usuarioLogado = null as any;

    this.router.navigate(['/login']);

  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUsuario(usuario: Usuario): void {

    this.usuarioLogado = usuario;

    localStorage.setItem(
      this.usuarioKey,
      JSON.stringify(usuario)
    );

  }

  getUsuario(): Usuario | null {

    if (!this.usuarioLogado) {

      const userStorage = localStorage.getItem(this.usuarioKey);

      if (userStorage) {
        this.usuarioLogado = JSON.parse(userStorage);
      }

    }

    return this.usuarioLogado;

  }

  getRole(): string | null {

    const usuario = this.getUsuario();

    return usuario ? usuario.role : null;

  }

  isAuthenticated(): boolean {

    const token = this.getToken();

    if (token && !this.isTokenExpired(token)) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;

  }

  private isTokenExpired(token: string): boolean {

    try {

      const payload = this.decodeTokenPayload(token);

      if (payload && payload.exp) {

        const expirationDate = new Date(0);

        expirationDate.setUTCSeconds(payload.exp);

        return expirationDate.valueOf() < new Date().valueOf();

      }

      return true;

    } catch (error) {

      console.error('Error decoding token:', error);

      return true;

    }

  }

  private decodeTokenPayload(token: string): any {

    try {

      const base64Url = token.split('.')[1];

      const base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      return JSON.parse(atob(base64));

    } catch (error) {

      console.error('Error decoding token payload:', error);

      return null;

    }

  }

}