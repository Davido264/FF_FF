import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';

import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css'],
})
export class ModalUsuarioComponent implements OnInit {
  formuladioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaRoles: Rol[] = [];
  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ) {
    const correoValidator = this.datosUsuario != null?
      Validators.compose([Validators.required,Validators.email])
      : Validators.email

    this.formuladioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['',correoValidator],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });
    if (this.datosUsuario != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
    }
    this._rolServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaRoles = data.value;
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    if (this.datosUsuario != null) {
      this.formuladioUsuario.patchValue({
        nombreCompleto: this.datosUsuario.nombreCompleto,
        correo: this.datosUsuario.correo,
        idRol: this.datosUsuario.idRol,
        clave: this.datosUsuario.clave,
        esActivo: this.datosUsuario.esActivo.toString(),
      });
    }
  }

  guardarEditar_Usuario() {
    const _usuario: Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formuladioUsuario.value.nombreCompleto,
      correo: this.formuladioUsuario.value.correo,
      idRol: this.formuladioUsuario.value.idRol,
      rolDescription: '',
      clave: this.formuladioUsuario.value.clave,
      esActivo: parseInt(this.formuladioUsuario.value.esActivo),
    };

    if (this.datosUsuario == null) {
      this._usuarioServicio.lista().subscribe({
        next: (data) => {
          if (!data.status) {
            this._utilidadServicio.mostrarAlerta("Error al verificar el correo","Opps!")
            return
          }

          const isNotAvailable = (data.value as Usuario[]).find(e => e.correo == _usuario.correo) != undefined
          if (isNotAvailable) {
            this._utilidadServicio.mostrarAlerta("Este correo ya ha sido registrado","Opps!")
            return

          }

          this._usuarioServicio.guardar(_usuario).subscribe({
            next: (data) => {
              if (data.status) {
                this._utilidadServicio.mostrarAlerta(
                  'El usuario fue registrado',
                  'Exito'
                );
                this.modalActual.close('true');
              } else
                this._utilidadServicio.mostrarAlerta(
                  'No se pudo regitrar el usuario',
                  'Error'
                );
            },
            error: (e) => {},
          });
        }
      });
    } else {
      this._usuarioServicio.editar(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilidadServicio.mostrarAlerta(
              'El usuario fue actualizado correctamente',
              'Exito'
            );
            this.modalActual.close('true');
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo actualizar al usuario',
              'Error'
            );
        },
        error: (e) => {},
      });
    }
  }
}
