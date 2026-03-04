import { VisitaReferenciaDTO } from "./visitareferenciaDTO.model";

export interface ReferenciaProdutoDTO {
    id?: number;
    linkProduto: string;
    numeroVendas: number;
    numeroEstoque: number;
    visitasUltimosQuinzeDias: number;
    quantidadeDiasCriado: number;
    visitas: VisitaReferenciaDTO[];
  }