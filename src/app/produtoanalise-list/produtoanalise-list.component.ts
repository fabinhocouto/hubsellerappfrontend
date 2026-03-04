import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProdutoAnaliseService } from '../services/produtoanalise.service';
import { ProdutoAnaliseResumoDTO } from '../models/produtoanaliseresumoDTO.model';
import { UsuarioResumidoDTO } from '../models/usuarioresumidoDTO.model';
import { UsuarioService } from '../services/usuario.service';
import { ProdutoAnaliseDTO } from '../models/produtoanaliseDTO.model';


@Component({
  selector: 'app-produtoanalise-list',
  templateUrl: './produtoanalise-list.component.html',
  styleUrls: ['./produtoanalise-list.component.css']
})
export class ProdutoAnaliseListComponent implements OnInit {

  constructor(private service: ProdutoAnaliseService, private serviceUsuario: UsuarioService) {}

  displayedColumns: string[] = ['descricao', 'preco', 'acoes'];
  dataSource = new MatTableDataSource<ProdutoAnaliseResumoDTO>();
  produtosOriginais: ProdutoAnaliseResumoDTO[] = [];

  usuarios: UsuarioResumidoDTO[] = [];
  usuarioSelecionadoId: number | null = null;
  
  ngOnInit(): void {
    this.serviceUsuario.loadUserResumido()
    .subscribe(res => {
      this.usuarios = res;
    });
  this.carregarProdutos();
}

filtrarPorUsuario() {

  if (!this.usuarioSelecionadoId) {
    this.dataSource.data = this.produtosOriginais;
    return;
  }
  console.log(this.usuarioSelecionadoId)
  this.dataSource.data = this.produtosOriginais
    .filter(p => p.usuario?.id === this.usuarioSelecionadoId);
}

  carregarProdutos(): void {
  this.service.listar().subscribe({
    next: (res) => {
      this.produtosOriginais = res;   // 🔥 guarda original
      this.dataSource.data = res;     // mostra na tabela
      console.log(this.dataSource.data);
    },
    error: (err) => {
      console.error('Erro ao buscar produtos analisados', err);
    }
  });
}

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  getStatusLabel(status: boolean | null): string {
  if (status === true) return 'Aprovado';
  if (status === false) return 'Reprovado';
  return 'Em análise';
}

getStatusIcon(status: boolean | null): string {
  console.log('status'+status)
  if (status === true) return 'check_circle';
  if (status === false) return 'cancel';
  return 'hourglass_top';
}

getStatusClass(status: boolean | null): string {
  if (status === true) return 'status-aprovado';
  if (status === false) return 'status-reprovado';
  return 'status-analise';
}

}