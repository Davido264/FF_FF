import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css'],
})
export class ModalDetalleVentaComponent implements OnInit {
  fechaRegistro: string = '';
  numeroDocumento: string = '';
  tipoPago: string = '';
  total: string = '';
  subtotal: string = '';
  iva: string = '';
  nombres: string = '';
  cedula: string = '';
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta) {
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.totalTexto;
    this.detalleVenta = _venta.detalleVenta;
    this.nombres = _venta.cliente.nombreCompleto;
    this.cedula = _venta.cliente.cedulaCliente;
    this.subtotal = _venta.detalleVenta.map(e => Number(e.totalTexto)).reduce((p,n) => p + n,0).toFixed(2)
    this.iva = (Number(this.subtotal) * 0.12).toFixed(2)
  }

  ngOnInit(): void {}
}
