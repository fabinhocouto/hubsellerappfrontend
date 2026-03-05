import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoAnaliseResumoDTO } from '../models/produtoanaliseresumoDTO.model';
import { ProdutoAnaliseDTO } from '../models/produtoanaliseDTO.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProdutoAnaliseService {

  private readonly API = environment.apiUrl+'/hubsellerapp-backend/produtos';

  constructor(private http: HttpClient) { }

  listar(): Observable<ProdutoAnaliseResumoDTO[]> {
    console.log()
    return this.http.get<ProdutoAnaliseResumoDTO[]>(this.API);
  }

  buscarPorId(id: number): Observable<ProdutoAnaliseDTO> {
    return this.http.get<ProdutoAnaliseDTO>(`${this.API}/${id}`);
  }

  salvar(produto: ProdutoAnaliseDTO): Observable<ProdutoAnaliseDTO> {
    return this.http.post<ProdutoAnaliseDTO>(`${this.API}/salvar`, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

}