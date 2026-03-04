import { ReferenciaProdutoDTO } from "./referenciaprodutoDTO.model";
import { UsuarioResumidoDTO } from "./usuarioresumidoDTO.model";

export interface ProdutoAnaliseResumoDTO {
  id: number;
  descricao: string;
  menorPreco: number;
  fotoBase64: string;
  possuiPerguntas: boolean;
  possuiAnunciosRecentes: boolean;
  linkAliExpress: string;
  usuario: UsuarioResumidoDTO;
}