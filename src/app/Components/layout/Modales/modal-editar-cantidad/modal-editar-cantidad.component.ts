import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';


@Component({
  selector: 'app-modal-editar-cantidad',
  templateUrl: './modal-editar-cantidad.component.html',
  styleUrls: ['./modal-editar-cantidad.component.css']
})
export class ModalEditarCantidadComponent {
  formularioProducto: FormGroup;

  constructor(
    private modalActual: MatDialogRef<ModalEditarCantidadComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { max: number, curr: number }
  ){
    this.formularioProducto = this.fb.group({
      cantidad: new FormControl(data.curr, Validators.compose([Validators.required, Validators.max(data.max), Validators.min(1)])),
    });
  }

  getError(): string {
    return this.formularioProducto.value.cantidad < 1? "No se permiten valores menores a 1" : "Stock Insuficiente"
  }

  closeDialog(cancel: boolean) {
    if (!cancel) {
      this.modalActual.close(this.formularioProducto.value.cantidad)
      return
    }
    this.modalActual.close(undefined)
  }
}
