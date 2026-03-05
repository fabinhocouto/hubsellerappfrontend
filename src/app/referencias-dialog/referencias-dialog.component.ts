import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoAnaliseService } from '../services/produtoanalise.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MercadoLivreService } from '../services/mercadolivre.service';
import { ReferenciaProdutoDTO } from '../models/referenciaprodutoDTO.model';


@Component({
  selector: 'app-referencias-dialog',
  templateUrl: './referencias-dialog.component.html',
  styleUrls: ['./referencias-dialog.component.css']
})
export class ReferenciasDialogComponent {

  novoLink: string = '';
  referencias: ReferenciaProdutoDTO[] = [];
  descricao: string = '';

  constructor(
  private mercadoLivreService: MercadoLivreService,
  private dialogRef: MatDialogRef<ReferenciasDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.referencias = Array.isArray(data?.referencias)
      ? [...data.referencias]
      : [];
  }

  adicionarLink() {
  if (!this.novoLink) return;

  const link = this.novoLink.trim();

  const novaReferencia: ReferenciaProdutoDTO = {
    linkProduto: link,
    numeroVendas: 0,
    numeroEstoque: 0,
    visitasUltimosQuinzeDias: 0,
    quantidadeDiasCriado: 0,
    visitas: []
  };

  this.referencias.push(novaReferencia);

  // mantém descrição
  this.descricao = this.extrairTituloDaUrl(link);

  // 🔥 chama backend
  this.mercadoLivreService.buscarDadosBasicosAnuncio(link)
    .subscribe({
      next: (dados) => {
        novaReferencia.visitasUltimosQuinzeDias = dados.numeroVisitasUltimosQuinzeDias;
        novaReferencia.quantidadeDiasCriado = dados.quantidadeDiasCriado;
        novaReferencia.visitas.push({
          dataVerificacao: new Date(),
          numeroVisitas: dados.quantidadeVisitas
        });
      },
      error: (err) => {
        console.error('Erro ao buscar dados do anúncio', err);
      }
    });

  this.novoLink = '';
}

  removerLink(index: number) {
    this.referencias.splice(index, 1);
  }

  salvar() {
    this.dialogRef.close({
      referencias: this.referencias,
      descricao: this.descricao
    });
  }

  fechar() {
    this.dialogRef.close();
  }

  extrairTituloDaUrl(url: string): string {
  try {
    const uri = new URL(url);
    const path = uri.pathname;

    if (!path) return '';

    const partes = path.split('/').filter(p => p);

    let titulo = '';

    for (let parte of partes) {
      // tenta remover prefixos de ID como "MLB-12345-" ou "MLBU12345" + "-"
      const semPrefixo = parte.replace(
        /^MLB[-_]\d+[-_]?|^MLBU\d+[-_]?/i, ''
      );

      if (semPrefixo && semPrefixo !== parte) {
        titulo = semPrefixo;
        break;
      }

      // se não contiver ID no começo, assume que é título
      if (!/^MLB|^MLBU/i.test(parte)) {
        titulo = parte;
        break;
      }
    }

    if (!titulo) return '';

    // decodifica e formata palavras
    titulo = decodeURIComponent(titulo)
      .replace(/[-_]+/g, ' ')
      .trim();

    // capitaliza cada palavra
    return titulo
      .split(' ')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');

  } catch {
    return '';
  }
}
copiarLink(link: string) {
  navigator.clipboard.writeText(link).then(() => {
    console.log('Link copiado!');
  });
}
extrairDominio(url: string): string {
  if (!url) return '';

  try {
    const dominio = new URL(url).hostname;
    return dominio.replace('www.', '');
  } catch {
    return url; // se der erro, retorna o próprio link
  }
}
getClasseCriacao(dias: number): string {
  if (dias <= 120) return 'chip-verde';
  if (dias <= 380) return 'chip-amarelo';
  return 'chip-vermelho';
}
getClassePerformance(visitas: number): string {
  const media = visitas / 15;

  if (media > 60) return 'performance-alta';
  if (media > 30) return 'performance-media';
  return 'performance-baixa';
}
}