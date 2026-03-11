import { UserRole } from "./userrole.enum";

export interface Usuario {
    id: number;
    nomeCompleto: string;
    login: string;
    senha: string;
    role: UserRole;
  }