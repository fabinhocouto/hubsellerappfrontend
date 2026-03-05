import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  private apiUrlLogin = environment.apiUrl+'/hubsellerapp-backend/autenticacao/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrlLogin, { username, password });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    console.log("passou aqui");
    const token = localStorage.getItem('authToken');
    console.log(token);
    if (token && !this.isTokenExpired(token)) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      // Decodifica o payload do token
      const payload = this.decodeTokenPayload(token);

      // Verifica se o token tem uma data de expiração
      if (payload && payload.exp) {
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(payload.exp); // Converte o timestamp para uma data

        // Compara a data de expiração com a data atual
        return expirationDate.valueOf() < new Date().valueOf();
      }
      return true; // Se não houver exp, considere como expirado
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Em caso de erro, considere como expirado
    }
  }

  private decodeTokenPayload(token: string): any {
    try {
      // Divide o token em suas partes (header, payload, signature)
      const base64Url = token.split('.')[1];

      // Converte de Base64Url para Base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // Decodifica o payload
      const payload = JSON.parse(atob(base64));
      return payload;
    } catch (error) {
      console.error('Error decoding token payload:', error);
      return null;
    }
  }

}