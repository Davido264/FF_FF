import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';
import { OnSameUrlNavigation } from '@angular/router';
import { ModalBusquedaProductosComponent } from '../../Modales/modal-busqueda-productos/modal-busqueda-productos.component';
import { ModalEditarCantidadComponent } from '../../Modales/modal-editar-cantidad/modal-editar-cantidad.component';
import { ModalBuscarClienteComponent } from '../../Modales/modal-buscar-cliente/modal-buscar-cliente.component';
import { Cliente } from 'src/app/Interfaces/cliente';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent implements OnInit {
  flexEnd: string = 'width: 100%; display: flex; justify-content: flex-end;';
  flexStart: string =
    'width: 100%; display: flex; justify-content: flex-start;';

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];

  listaProductoParaVenta: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  cliente?: Cliente;
  tipodePagoPorDefecto: string = 'Efectivo';
  subTotal: number = 0;
  iva: number = 0;
  total: number = 0;

  columnasTabla: string[] = [
    'producto',
    'cantidad',
    'precio',
    'total',
    'accion',
  ];
  datosDetalleVenta = new MatTableDataSource(this.listaProductoParaVenta);

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado =
      typeof busqueda === 'string'
        ? busqueda.toLocaleLowerCase()
        : busqueda.nombre.toLocaleLowerCase();

    return this.listaProductos.filter((item) =>
      item.nombre.toLocaleLowerCase().includes(valorBuscado)
    );
  }

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService,
    private _productoDialog: MatDialog,
    private _clienteDialog: MatDialog,
    private _edicionProductoDialog: MatDialog,
  ) {

    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(
            (p) => p.esActivo == 1 && p.stock > 0
          );
        }
      },
      error: (e) => {},
    });
  }

  ngOnInit(): void {}

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  buscarClientes() {
    this._clienteDialog
      .open(ModalBuscarClienteComponent, {
        disableClose: true,
        width: '90svw',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado) {
          this.cliente = resultado
        }
      });
  }

  buscarProductos() {
    this._productoDialog
      .open(ModalBusquedaProductosComponent, {
        data: { listaProductos: this.listaProductos, listaProductoParaVenta: this.listaProductoParaVenta },
        disableClose: true,
        width: '90svw',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado) {
          this.agregarProductosParaVenta(resultado.updatedData, resultado.listaProductoParaVenta)
        }
      });
  }

  agregarProductosParaVenta(updatedData: Producto[],listaProductoParaVenta: DetalleVenta[]) {
    this.listaProductos = updatedData
    this.listaProductoParaVenta = listaProductoParaVenta

    this.subTotal = this.listaProductoParaVenta
      .map(d => Number(d.totalTexto))
      .reduce((p,n) => p + n, 0)

    this.iva = this.subTotal * 0.12;
    this.total = this.subTotal + this.iva;

    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductoParaVenta
    );
  }

  modificarCantidadProducto(detalle: DetalleVenta) {
    const producto = this.listaProductos.find(p => p.idProducto === detalle.idProducto)!
    this._edicionProductoDialog
      .open(ModalEditarCantidadComponent, {
        data: { curr: detalle.cantidad, max: producto.stock },
        disableClose: true,
        width: '60svw',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado) {
          const producto = this.listaProductos.find(p => p.idProducto === detalle.idProducto)
          producto!.stock += (detalle.cantidad - resultado)

          detalle.cantidad = resultado
          detalle.totalTexto = (Number(detalle.precioTexto) * resultado).toFixed(2)

          this.subTotal = this.listaProductoParaVenta
            .map(d => Number(d.totalTexto))
            .reduce((p,n) => p + n, 0)

          this.iva = this.subTotal * 0.12;
          this.total = this.subTotal + this.iva;

          this.datosDetalleVenta = new MatTableDataSource(
            this.listaProductoParaVenta
          );
        }
      });
  }

  eliminarProducto(detalle: DetalleVenta) {
    this.subTotal = this.subTotal - parseFloat(detalle.totalTexto)
    this.listaProductoParaVenta = this.listaProductoParaVenta.filter(
        (p) => p.idProducto != detalle.idProducto
    );

    const producto = this.listaProductos.find((p) => p.idProducto === detalle.idProducto)
    producto!.stock += detalle.cantidad

    this.iva = this.subTotal * 0.12;
    this.total = this.subTotal + this.iva;

    this.datosDetalleVenta = new MatTableDataSource(
      this.listaProductoParaVenta
    );
  }

  registrarVenta() {
    if (this.listaProductoParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;
      const request: Venta = {
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.subTotal.toFixed(2)),
        detalleVenta: this.listaProductoParaVenta,
      };

      this._ventaServicio.registrar(request).subscribe({
        next: (reponse) => {
          if (reponse.status) {
            this.subTotal = 0.0;
            this.listaProductoParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(
              this.listaProductoParaVenta
            );

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Numero de venta: ${reponse.value.numeroDocumento}`,
            });
          } else
            this._utilidadServicio.mostrarAlerta(
              'No se pudo registrar la venta',
              'Opps!'
            );
        },

        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: (e) => {},
      });
    }
  }
}
