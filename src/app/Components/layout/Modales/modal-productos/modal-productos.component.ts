import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ImagePickerConf } from '@codebuilt/ngp-image-picker';

@Component({
  selector: 'app-modal-productos',
  templateUrl: './modal-productos.component.html',
  styleUrls: ['./modal-productos.component.css'],
})
export class ModalProductosComponent implements OnInit {
  formularioProducto: FormGroup;
  tituloAccion: string = 'Agregar';
  botonAccion: string = 'Guardar';
  listaCategorias: Categoria[] = [];
  imagenSeleccionada: string | null = null;

  imgPickerConfig: ImagePickerConf = {
    language: 'es',
    // objectFit: 'contain',
    hideDeleteBtn: false,
    hideDownloadBtn: true,
    hideEditBtn: true,
    hideAddBtn: false
  };

  imagenInicial?: string

  constructor(
    private modalActual: MatDialogRef<ModalProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: Producto,
    private fb: FormBuilder,
    private _categoriaServicio: CategoriaService,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService,
  ) {
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });
    if (this.datosProducto != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';
      this.imagenInicial = this.datosProducto.urlImagen
    }
    this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategorias = data.value;
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: this.datosProducto.idCategoria,
        stock: this.datosProducto.stock,
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString(),
      });
      this.imagenInicial = this.datosProducto.urlImagen;
    }
  }

  guardarEditar_Producto() {
    const _producto: Producto = {
      idProducto:
        this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      categoriaDescription: '',
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.esActivo),
    };

    if (this.datosProducto == null) {
      if (this.imagenSeleccionada != null) {
        this._productoServicio.urlSubirArchivo().subscribe({
          next: (data) => {
            const file = this.dataURItoFile(this.imagenSeleccionada!,"upload")
            this._productoServicio.subirImagen(data.value,file).subscribe({
              next: (_) => {
                _producto.urlImagen = data.value.split("?")[0]
                this.subirProducto(_producto)
              },
              error: (e) => { console.error(e) }
            })
          },
          error: (e) => { console.error(e) }
        })
      } else {
        this.subirProducto(_producto)
      }
    } else {
      if (this.imagenSeleccionada != null) {
      this._productoServicio.urlSubirArchivo().subscribe({
        next: (data) => {
          const file = this.dataURItoFile(this.imagenSeleccionada!,"upload")
          this._productoServicio.subirImagen(data.value,file).subscribe({
            next: (_) => {
                _producto.urlImagen = data.value.split("?")[0]
                this.editarProducto(_producto)
            },
            error: (e) => { console.error(e) }
          })
        },
        error: (e) => { console.error(e) }
      })
      } else {
        this.editarProducto(_producto)
      }
    }
  }

  subirProducto(producto: Producto) {
    this._productoServicio.guardar(producto).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilidadServicio.mostrarAlerta(
            'El producto fue registrado',
            'Exito'
          );
          this.modalActual.close('true');
          this.imagenInicial = producto.urlImagen
        } else {
          this._utilidadServicio.mostrarAlerta(
            'No se pudo regitrar el producto',
            'Error'
          );
        }
      },
      error: (e) => {},
    });
  }

  editarProducto(producto: Producto) {
    this._productoServicio.editar(producto).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilidadServicio.mostrarAlerta(
            'El producto fue actualizado correctamente',
            'Exito'
          );
          this.modalActual.close('true');
          this.imagenInicial = producto.urlImagen
        } else {
          this._utilidadServicio.mostrarAlerta(
            'No se pudo actualizar al producto',
            'Error'
          );
        }
      },
      error: (e) => {},
    });
  }

  onImageChanged(fileUri: any) {
    this.imagenSeleccionada = fileUri;
  }

  dataURItoFile(dataURI: string, fileName: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], fileName, { type: mimeString });
  }

}
