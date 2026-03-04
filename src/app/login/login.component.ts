import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  invalidCredentials = false;
  serverOut = false;

  constructor(private fb: FormBuilder,private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.invalidCredentials = false;
          this.serverOut = false;
          this.router.navigate(['/home']);
        },
        error: (err) => {
          if(err.status == 403){
            this.invalidCredentials = true;
            this.serverOut = false;
          }else{
            this.invalidCredentials = false;
            this.serverOut = true;
          }
          console.error('Erro ao fazer login:', err);
        }
      });
      
    }
    
    /*this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = 'Usuário ou senha inválidos';
      }
    );*/
  }
}