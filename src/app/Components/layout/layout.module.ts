import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';
import { SharedModule } from 'src/app/Reutilizable/shared/shared.module';
import { ModalUsuarioComponent } from './Modales/modal-usuario/modal-usuario.component';
import { ModalProductosComponent } from './Modales/modal-productos/modal-productos.component';
import { ModalDetalleVentaComponent } from './Modales/modal-detalle-venta/modal-detalle-venta.component';
import { ModalBusquedaProductosComponent } from './Modales/modal-busqueda-productos/modal-busqueda-productos.component';
import { ModalEditarCantidadComponent } from './Modales/modal-editar-cantidad/modal-editar-cantidad.component';
import { ClienteComponent } from './Pages/cliente/cliente.component';
import { ModalBuscarClienteComponent } from './Modales/modal-buscar-cliente/modal-buscar-cliente.component';
import { ModalClienteComponent } from './Modales/modal-cliente/modal-cliente.component';

@NgModule({
  declarations: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,
    ModalUsuarioComponent,
    ModalProductosComponent,
    ModalDetalleVentaComponent,
    ModalBusquedaProductosComponent,
    ModalEditarCantidadComponent,
    ClienteComponent,
    ModalBuscarClienteComponent,
    ModalClienteComponent,
  ],
  imports: [CommonModule, LayoutRoutingModule, SharedModule],
})
export class LayoutModule {}
