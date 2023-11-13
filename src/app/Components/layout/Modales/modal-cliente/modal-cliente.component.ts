import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Cliente } from 'src/app/Interfaces/cliente';
import { ClientesService } from 'src/app/Services/clientes.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.css']
})
export class ModalClienteComponent {
  formularioCliente: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';

  constructor(
    private modalActual: MatDialogRef<ModalClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public datosCliente: Cliente,
    private fb: FormBuilder,
    private _productoCliente: ClientesService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioCliente = this.fb.group({
      cedulaCliente: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      correo: ['', Validators.compose([Validators.required,Validators.email])],
      direccion: ['', Validators.required],
    });
    if (this.datosCliente != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
  }

  ngOnInit(): void {
    if (this.datosCliente != null) {
      this.formularioCliente.patchValue({
        cedulaCliente: this.datosCliente.cedulaCliente,
        nombreCompleto: this.datosCliente.nombreCompleto,
        correo: this.datosCliente.correo,
        direccion: this.datosCliente.direccion,
      });
    }
  }

  guardarEditar_Cliente() {
    const _cliente: Cliente = {
      cedulaCliente: this.formularioCliente.value.cedulaCliente,
      nombreCompleto: this.formularioCliente.value.nombreCompleto,
      correo: this.formularioCliente.value.idCategoria,
      direccion: this.formularioCliente.value.direccion,
    };

    if (this.datosCliente == null) {
      this._productoCliente.guardar(_cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El cliente fue registrado',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo regitrar el cliente',
              'Error'
            );
        },
        error: (e) => {},
      });
    } else {
      this._productoCliente.editar(_cliente).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El cliente fue actualizado correctamente',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo actualizar al cliente',
              'Error'
            );
        },
        error: (e) => {},
      });
    }
  }
}
