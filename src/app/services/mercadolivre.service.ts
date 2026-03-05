import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoAnaliseResumoDTO } from '../models/produtoanaliseresumoDTO.model';
import { ProdutoAnaliseDTO } from '../models/produtoanaliseDTO.model';
import { DadosBasicoAnuncioDTO } from '../models/dadosbasicoanuncioDTO.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MercadoLivreService {

  private readonly API = environment.apiUrl+'/hubsellerapp-backend/mercadolivre';

  constructor(private http: HttpClient) { }

  buscarVisitasUltimosQuinzeDias(url: string): Observable<number> {
    return this.http.post<number>(`${this.API}/visitas-ultimos-quinze-dias`, {
      url: url
    });
  }

  buscarDadosBasicosAnuncio(url: string): Observable<DadosBasicoAnuncioDTO> {
    return this.http.post<DadosBasicoAnuncioDTO>(`${this.API}/dados-basicos-anuncio`, {
      url: url
    });
  }

}