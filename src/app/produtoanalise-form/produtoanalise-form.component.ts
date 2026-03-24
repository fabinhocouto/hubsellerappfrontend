import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoAnaliseService } from '../services/produtoanalise.service';
import { MatDialog } from '@angular/material/dialog';
import { ReferenciasDialogComponent } from '../referencias-dialog/referencias-dialog.component';
import { ImgBBService } from '../services/imgbb.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HostListener } from '@angular/core';
import { StatusProdutoAnalise } from '../models/status-produto-analise.enum';
import { AuthService } from '../auth.service';
import { UserRole } from '../models/userrole.enum';
import {IMyOptions, IMyDateModel, MyDatePickerModule} from 'mydatepicker';

@Component({
  selector: 'app-produtoanalise-form',
  templateUrl: './produtoanalise-form.component.html',
  styleUrls: ['./produtoanalise-form.component.css']
})
export class ProdutoAnaliseFormComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  currencyOptions = {
  prefix: 'R$ ',
  thousands: '.',
  decimal: ',',
  align: 'left'
};

  form!: FormGroup;
  modoEdicao = false;
  produtoId!: number;
  salvando = false;
  dragging = false;
  expandidoReferenia = false;
  expandidoAvaliacao = false;
  StatusProdutoAnalise = StatusProdutoAnalise;
  usuarioSomenteLeitura = false;
  previewImagem: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: ProdutoAnaliseService,
    private dialog: MatDialog,
    private serviceImgBB: ImgBBService,
    private snackBar: MatSnackBar ,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

  this.form = this.criarFormulario();

  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.modoEdicao = true;
    this.expandidoReferenia = !this.modoEdicao;
    this.produtoId = +id;
    this.carregarProduto(this.produtoId);
  } else {
    this.expandidoReferenia = !this.modoEdicao;
    this.abrirDialogLink();
  }

}

criarFormulario(): FormGroup {

  return this.fb.group({

    id: [],

    descricao: ['', Validators.required],

    menorPreco: [null],

    possuiPerguntas: [true],

    possuiAnunciosRecentes: [true],

    linkAliExpress: ['', Validators.required],

    fotoBase64: [''],

    fotoUrlImgBB: [''],

    observacao: [''],

    usuario: [null],

    status: [StatusProdutoAnalise.MONITORANDO],

    produtoAvaliacao: this.fb.group({
      id: [],
      observacao: ['']
    }),

    referencias: this.fb.array([])

  });

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
    if (!produto.produtoAvaliacao) {
      produto.produtoAvaliacao = {
        observacao: ''
      };
    }

    this.form = this.criarFormulario();

    // 🔥 NOVO: Garante 2 casas decimais no preço
    if (produto.menorPreco) {
      produto.menorPreco = parseFloat(produto.menorPreco.toFixed(2));
    }

    this.form.patchValue({
      ...produto,
      status: produto.status,
      produtoAvaliacao: {
        id: produto.produtoAvaliacao?.id,
        observacao: produto.produtoAvaliacao?.observacao || ''
      }
    });
    console.log(produto);

    this.previewImagem = this.form.get('fotoUrlImgBB')?.value || null;

    // 🔥 NOVO: Formata o preço se existir
    if (produto.menorPreco) {
      const inputPreco = document.querySelector('input[formControlName="menorPreco"]') as HTMLInputElement;
      if (inputPreco) {
        const valorCentavos = Math.round(produto.menorPreco * 100).toString().padStart(3, '0');
        const inteiro = valorCentavos.slice(0, -2) || '0';
        const centavos = valorCentavos.slice(-2);
        const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        inputPreco.value = `R$ ${inteiroFormatado},${centavos}`;
      }
    }

    const usuario = this.authService.getUsuario();
    console.log("ROLE:", usuario?.role);
    console.log("ENUM USER:", UserRole.USER);
    
    if (usuario?.role === UserRole.USER) {
      this.form.get('status')?.disable();
      this.form.get('produtoAvaliacao.observacao')?.disable();
    }
    
    if(StatusProdutoAnalise.MONITORANDO !== produto.status){
      this.expandidoAvaliacao = true;
      this.expandidoReferenia = false;
    }else{
      this.expandidoAvaliacao = false;
      this.expandidoReferenia = true;
    }

    this.referencias.clear();

    produto.referencias?.forEach(ref => {
      const refGroup = this.fb.group({
        id: [ref.id],
        linkProduto: [ref.linkProduto],
        numeroVendas: [ref.numeroVendas],
        numeroEstoque: [ref.numeroEstoque],
        visitasUltimosQuinzeDias: [ref.visitasUltimosQuinzeDias],
        visitas: [ref.visitas],
        observacao: [''],
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

  if (produto.menorPreco == null) {
    produto.menorPreco = 0;
  }

  this.salvando = true;

  console.log(produto)

  this.service.salvar(produto)
    .subscribe({
      next: (response) => {

        this.salvando = false;

        // 🔥 agora entra em modo edição
        this.modoEdicao = true;
        this.expandidoAvaliacao = !this.modoEdicao;

        // se backend retornou id, atualiza no form
        if (response.id) {
          this.form.patchValue({ id: response.id });
        }

        // 🔥 IMPORTANTE
        if (response.produtoAvaliacao?.id) {
          this.form.get('produtoAvaliacao.id')?.setValue(response.produtoAvaliacao.id);
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

  if (file) {
    this.processarArquivo(file);
  }

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

processarArquivo(file: File) {

  const reader = new FileReader();

  reader.onload = () => {

    const result = reader.result as string;

    // preview imediato
    this.previewImagem = result;

    const base64 = result.split(',')[1];

    this.serviceImgBB.uploadImagem(base64).subscribe({
      next: (urlThumb) => {

        // salva apenas URL do ImgBB
        this.form.get('fotoUrlImgBB')?.setValue(urlThumb);

        // preview agora usa a url real
        this.previewImagem = urlThumb;

      },
      error: (err) => {
        console.error('Erro ao enviar imagem', err);
      }
    });

  };

  reader.readAsDataURL(file);
}
onDragOver(event: DragEvent) {
  event.preventDefault();
  this.dragging = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.dragging = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.dragging = false;

  if (!event.dataTransfer?.files.length) return;

  const file = event.dataTransfer.files[0];

  if (file.type.startsWith('image/')) {
    this.processarArquivo(file);
  }
}

@HostListener('document:paste', ['$event'])
onPaste(event: ClipboardEvent) {

  const items = event.clipboardData?.items;
  if (!items) return;

  let encontrouImagem = false;

  for (let i = 0; i < items.length; i++) {

    if (items[i].type.startsWith('image')) {

      encontrouImagem = true;

      const blob = items[i].getAsFile();

      if (blob) {
        const file = new File([blob], 'print.png', { type: blob.type });
        this.processarArquivo(file);
      }

    }

  }

  // Só bloqueia o paste normal se for imagem
  if (encontrouImagem) {
    event.preventDefault();
  }

}
toggleReferencias() {
  this.expandidoReferenia = !this.expandidoReferenia;
}

toggleAvaliacao() {
  this.expandidoAvaliacao = !this.expandidoAvaliacao;
}

getIconeStatus(): string {

  const status = this.form.get('status')?.value;

  switch (status) {
    case 'MONITORANDO': return 'analytics';
    case 'COTANDO': return 'search';
    case 'REPROVADO': return 'cancel';
    case 'APROVADO': return 'check_circle';
    default: return 'help';
  }

}

getClasseStatus(): string {

  const status = this.form.get('status')?.value;

  switch (status) {
    case 'MONITORANDO': return 'status-monitorando';
    case 'COTANDO': return 'status-cotando';
    case 'REPROVADO': return 'status-reprovado';
    case 'APROVADO': return 'status-aprovado';
    default: return '';
  }

}

apenasNumeros(event: KeyboardEvent) {
  const char = String.fromCharCode(event.which);
  if (!/[0-9]/.test(char)) {
    event.preventDefault();
  }
}

formatarPrecoInput(event: any) {
  let valor = event.target.value.replace(/\D/g, '');

  if (!valor) {
    event.target.value = '';
    this.form.get('menorPreco')?.setValue(null, { emitEvent: false });
    return;
  }

  // Converte para número dividindo por 100 (centavos)
  const numero = parseInt(valor) / 100;

  // Formata para exibir
  const formatado = numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  event.target.value = `R$ ${formatado}`;
  this.form.get('menorPreco')?.setValue(numero, { emitEvent: false });
}
}