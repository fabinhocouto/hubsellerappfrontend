import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoAnaliseService } from '../services/produtoanalise.service';
import { MatDialog } from '@angular/material/dialog';
import { ReferenciasDialogComponent } from '../referencias-dialog/referencias-dialog.component';
import { ImgBBService } from '../services/imgbb.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-produtoanalise-form',
  templateUrl: './produtoanalise-form.component.html',
  styleUrls: ['./produtoanalise-form.component.css']
})
export class ProdutoAnaliseFormComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form!: FormGroup;
  modoEdicao = false;
  produtoId!: number;
  salvando = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: ProdutoAnaliseService,
    private dialog: MatDialog,
    private serviceImgBB: ImgBBService,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
            id: [],
            descricao: ['', Validators.required],
            menorPreco: [0],
            possuiPerguntas: [true],
            possuiAnunciosRecentes: [true],
            linkAliExpress: ['', Validators.required],
            fotoBase64: [''],
            fotoUrlImgBB: [''],
            observacao: [''], 
            referencias: this.fb.array([])
          });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicao = true;
      this.produtoId = +id;
      this.carregarProduto(this.produtoId);
    }else{
      this.abrirDialogLink();
    }
  }

  abrirDialogLink() {

  const dialogRef = this.dialog.open(ReferenciasDialogComponent, {
    width: '900px',
    data: { referencias: this.referencias }
  });

  dialogRef.afterClosed().subscribe((result) => {

  if (result?.referencias) {

    result.referencias.forEach((ref: any) => {

      const refGroup = this.fb.group({
        id: [ref.id],
        linkProduto: [ref.linkProduto],
        numeroVendas: [ref.numeroVendas],
        numeroEstoque: [ref.numeroEstoque],
        visitasUltimosQuinzeDias: [ref.visitasUltimosQuinzeDias],
        visitas: [ref.visitas],
        observacao:['']
      });

      this.referencias.push(refGroup);
    });
  }

  // 🔥 preenche descrição se existir
  if (result?.descricao) {
    this.form.get('descricao')?.setValue(result.descricao);
  }
});
}

carregarProduto(id: number) {
  this.service.buscarPorId(id).subscribe(produto => {

    this.form.patchValue(produto);
    this.referencias.clear();

    produto.referencias?.forEach(ref => {

      const refGroup = this.fb.group({
        id: [ref.id],
        linkProduto: [ref.linkProduto],
        numeroVendas: [ref.numeroVendas],
        numeroEstoque: [ref.numeroEstoque],
        visitasUltimosQuinzeDias:[ref.visitasUltimosQuinzeDias],
        visitas: [ref.visitas], // readonly,
        fotoBase64: ['']
      });
      this.referencias.push(refGroup);
    });

  });
}

  salvar() {

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const produto = this.form.getRawValue();
  this.salvando = true;

  this.service.salvar(produto)
    .subscribe({
      next: (response) => {

        this.salvando = false;

        // 🔥 agora entra em modo edição
        this.modoEdicao = true;

        // se backend retornou id, atualiza no form
        if (response.id) {
          this.form.patchValue({ id: response.id });
        }

        // 🔥 mensagem de sucesso
        this.snackBar.open(
          'Salvo com sucesso!',
          'Fechar',
          {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );
      },
      error: (err) => {
        this.salvando = false;
        console.error('Erro ao salvar:', err);
      }
    });
}

  cancelar() {
    this.router.navigate(['/analiseproduto']);
  }

  get referencias(): FormArray {
  return this.form.get('referencias') as FormArray;
  }

  adicionarReferencia() {
  const referenciaForm = this.fb.group({
    id: [],
    linkProduto: [''],
    numeroVendas: [0],
    numeroEstoque: [0],
    fotoBase64: ['']
  });

  this.referencias.push(referenciaForm);
}

removerReferencia(index: number) {
  this.referencias.removeAt(index);
}
getClassePerformance(visitas: number): string {
  let media = visitas / 15;
  if (media > 60) return 'performance-alta';
  if (media > 30) return 'performance-media';
  return 'performance-baixa';
}
abrirAnuncio(url: string) {
  window.open(url, '_blank');
}

selecionarArquivo() {
  this.fileInput.nativeElement.click();
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    const result = reader.result as string;

    // remove prefixo
    const base64 = result.split(',')[1];

    this.serviceImgBB.uploadImagem(base64).subscribe({
      next: (urlThumb) => {
        // seta URL da imagem (não base64)
        this.form.get('fotoUrlImgBB')?.setValue(urlThumb);
      },
      error: (err) => {
        console.error('Erro ao enviar imagem', err);
      }
    });
  };

  reader.readAsDataURL(file);
}
}