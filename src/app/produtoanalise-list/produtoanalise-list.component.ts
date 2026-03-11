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

  getStatusLabel(status: string): string {

  switch (status) {
    case 'MONITORANDO': return 'Monitorando';
    case 'COTANDO': return 'Cotando';
    case 'REPROVADO': return 'Reprovado';
    case 'APROVADO': return 'Aprovado';
    default: return 'Desconhecido';
  }

}

getStatusIcon(status: string): string {

  switch (status) {
    case 'MONITORANDO': return 'analytics';
    case 'COTANDO': return 'search';
    case 'REPROVADO': return 'cancel';
    case 'APROVADO': return 'check_circle';
    default: return 'help';
  }

}

getStatusClass(status: string): string {

  switch (status) {
    case 'MONITORANDO': return 'status-monitorando';
    case 'COTANDO': return 'status-cotando';
    case 'REPROVADO': return 'status-reprovado';
    case 'APROVADO': return 'status-aprovado';
    default: return '';
  }

}

}