import { ReferenciaProdutoDTO } from "./referenciaprodutoDTO.model";
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
  referencias: ReferenciaProdutoDTO[];
}