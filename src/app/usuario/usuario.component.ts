import { ChangeDetectorRef, Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  userForm!: FormGroup;
  users: Usuario[] = [];
  isEditing = false;
  editIndex: number | null = null;
  dataSource = new MatTableDataSource<Usuario>(this.users);
  displayedColumns: string[] = ['fullName', 'username', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private userService: UsuarioService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id:[],
      nomeCompleto: ['', Validators.required],
      login: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.onLoad();
  }
 
  save(){
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      const userData = this.userForm.value;
      if (this.isEditing && this.editIndex !== null) {
        this.userService.saveUser(userData).subscribe({
          next: (response) => {
            if(this.editIndex != null){
              this.users[this.editIndex] = userData;
            }
          },
          error: (err) => {
            
          }
        });
        
      } else {
        // Chama o serviço para criar o usuário
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          console.log(response)
          this.users.push(response);
          console.log(this.users)
        },
        error: (err) => {
          
        }
      });
      }
      this.resetForm();
      this.updateTable();

    }
  }

  onLoad(){
    this.userService.loadUser().subscribe({
      next: (response) => {
        this.users = response;
        this.updateTable();
      },
      error: (err) => {
        
      }
    });
  }

  onEdit(user: Usuario, index: number): void {
    this.userForm.setValue({
      id: user.id,
      nomeCompleto: user.nomeCompleto,
      login: user.login,
      senha: user.senha
    });
    this.isEditing = true;
    this.editIndex = index;
  }

  onDelete(index: number): void {
    this.users.splice(index, 1);
    this.updateTable();
  }

  onCancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    // Resetando o formulário
    this.userForm.reset();
    
    // Resetando o estado de edição
    this.isEditing = false;
    this.editIndex = null;
  }

  updateTable(): void {
    this.dataSource.data = [...this.users]; // Atualiza a tabela com nova referência
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}