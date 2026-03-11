import { Usuario } from "./usuario.model";

export interface LoginResponseDTO {
  token: string;
  usuario: Usuario;
}