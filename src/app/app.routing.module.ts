import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ProdutoAnaliseListComponent } from './produtoanalise-list/produtoanalise-list.component';
import { ProdutoAnaliseFormComponent } from './produtoanalise-form/produtoanalise-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  {
  path: 'analiseproduto',
  children: [
    { path: '', component: ProdutoAnaliseListComponent },
    { path: 'novo', component: ProdutoAnaliseFormComponent },
    { path: 'editar/:id', component: ProdutoAnaliseFormComponent }
  ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}