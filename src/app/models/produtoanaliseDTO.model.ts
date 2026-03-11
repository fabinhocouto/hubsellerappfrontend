import { ProdutoAvaliacaoDTO } from "./produtoavaliacaoDTO.model";
import { ReferenciaProdutoDTO } from "./referenciaprodutoDTO.model";
import { StatusProdutoAnalise } from "./status-produto-analise.enum";
import { UsuarioResumidoDTO } from "./usuarioresumidoDTO.model";

export interface ProdutoAnaliseDTO {
  id?: number;
  descricao: string;
  menorPreco: number;
  fotoBase64: string;
  fotoUrlImgBB: string;
  possuiPerguntas: boolean;
  possuiAnunciosRecentes: boolean;
  linkAliExpress: string;
  observacao: string;
  resultadoAnalise: boolean;
  usuario: UsuarioResumidoDTO;
  produtoAvaliacao: ProdutoAvaliacaoDTO;
  status?: StatusProdutoAnalise;
  referencias: ReferenciaProdutoDTO[];
}