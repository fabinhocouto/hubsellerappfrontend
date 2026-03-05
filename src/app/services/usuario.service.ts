import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { UsuarioResumidoDTO } from '../models/usuarioresumidoDTO.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root' // O serviço é fornecido no nível raiz
})
export class UsuarioService {
  private apiUrlCriarLogin = environment.apiUrl+'/hubsellerapp-backend/autenticacao/criar';
  private apiUrlAtualizarUsuario = environment.apiUrl+'/hubsellerapp-backend/usuarios/salvar';
  private apiUrlLoadUsuario = environment.apiUrl+'/hubsellerapp-backend/usuarios/find-all';
  private apiUrlLoadUsuarioResumido = environment.apiUrl+'/hubsellerapp-backend/usuarios/find-all-resumido';

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