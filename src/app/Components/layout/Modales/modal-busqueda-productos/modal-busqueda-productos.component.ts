import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from 'src/app/Services/producto.service';
import { Producto } from 'src/app/Interfaces/producto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

@Component({
  selector: 'app-modal-busqueda-productos',
  templateUrl: './modal-busqueda-productos.component.html',
  styleUrls: ['./modal-busqueda-productos.component.css'],
})
export class ModalBusquedaProductosComponent implements AfterViewInit {
  columnasTabla: string[] = [
    'nombre',
    'categoria',
    'stock',
    'precio',
    'acciones',
  ];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  listaProductoParaVenta: DetalleVenta[] = [];
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService,
    private _dialogRef: MatDialogRef<ModalBusquedaProductosComponent>,
    @Inject(MAT_DIALOG_DATA) public dataInicio: Producto[]
  ) {}

  closeDialog(canceled: boolean) {
    if (!canceled) {
      this._dialogRef.close({ updatedData: this.dataInicio, listaProductoParaVenta: this.listaProductoParaVenta})
      return
    }

    this.listaProductoParaVenta.forEach(d => {
      const producto = this.dataInicio.find(i => i.idProducto === d.idProducto)
      producto!.stock += d.cantidad
    })
    this.listaProductoParaVenta = []

    this._dialogRef.close({ updatedData: this.dataInicio, listaProductoParaVenta: this.listaProductoParaVenta})
  }

  reduceCount(item: Producto) {
    item.stock -= 1
    const _precio: number = parseFloat(item.precio);

    this.listaProductoParaVenta.push({
      idProducto: item.idProducto,
      productoDescription: item.nombre,
      cantidad: 1,
      precioTexto: _precio.toFixed(2),
      totalTexto: _precio.toFixed(2),
    })
  }

  checkDisabled(id: number): boolean {
    return this.listaProductoParaVenta.some(p => p.idProducto === id)
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  }
}
