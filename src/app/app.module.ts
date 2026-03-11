import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing.module';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { UsuarioComponent } from './usuario/usuario.component';
import { MatTableModule } from '@angular/material/table';
import { UsuarioService } from './services/usuario.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ProdutoAnaliseService } from './services/produtoanalise.service';
import { ProdutoAnaliseFormComponent } from './produtoanalise-form/produtoanalise-form.component';
import { ProdutoAnaliseListComponent } from './produtoanalise-list/produtoanalise-list.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReferenciasDialogComponent } from './referencias-dialog/referencias-dialog.component';
import { MercadoLivreService } from './services/mercadolivre.service';
import { MatChipsModule } from '@angular/material/chips';
import { ImgBBService } from './services/imgbb.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgxCurrencyDirective } from 'ngx-currency';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    ProdutoAnaliseFormComponent,
    ProdutoAnaliseListComponent,
    ReferenciasDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxCurrencyDirective
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    provideNgxMask(),
    AuthGuard,
    AuthService,
    UsuarioService,
    ProdutoAnaliseService,
    MercadoLivreService,
    ImgBBService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
