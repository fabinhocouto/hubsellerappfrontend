import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { UsuarioResumidoDTO } from '../models/usuarioresumidoDTO.model';


@Injectable({
  providedIn: 'root' // O serviço é fornecido no nível raiz
})
export class UsuarioService {
  private apiUrlCriarLogin = 'http://localhost:8080/hubsellerapp-backend/autenticacao/criar';
  private apiUrlAtualizarUsuario = 'http://localhost:8080/hubsellerapp-backend/usuarios/salvar';
  private apiUrlLoadUsuario = 'http://localhost:8080/hubsellerapp-backend/usuarios/find-all';
  private apiUrlLoadUsuarioResumido = 'http://localhost:8080/hubsellerapp-backend/usuarios/find-all-resumido';

  constructor(private http: HttpClient) {}

  // Método para criar um usuário
  createUser(user: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrlCriarLogin, user);
  }

  saveUser(user: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrlAtualizarUsuario, user);
  }

  loadUser(): Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(this.apiUrlLoadUsuario);
  }

  loadUserResumido(): Observable<Array<UsuarioResumidoDTO>> {
    return this.http.get<Array<UsuarioResumidoDTO>>(this.apiUrlLoadUsuarioResumido);
  }
}