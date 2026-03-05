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
export class ImgBBService {

  private readonly API = environment.apiUrl+'/hubsellerapp-backend/imgbb';

  constructor(private http: HttpClient) { }

 uploadImagem(base64: string): Observable<string> {
  return this.http.post(
    `${this.API}/upload`,
    { base64: base64 },
    { responseType: 'text' } // 👈 importante
  );
}

}