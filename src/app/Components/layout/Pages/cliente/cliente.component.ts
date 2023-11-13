import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Cliente } from 'src/app/Interfaces/cliente';
import { ClientesService } from 'src/app/Services/clientes.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { ModalClienteComponent } from '../../Modales/modal-cliente/modal-cliente.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = [
    'cedula',
    'nombres',
    'direccion',
    'correo',
    'acciones',
  ];
  dataInicio: Cliente[] = [];
  dataListaCliente = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _clienteServicio: ClientesService,
    private _utilidadServicio: UtilidadService
  ) {}

  obtenerClientes() {
    this._clienteServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.dataListaCliente.data = data.value;
        else
          this._utilidadServicio.mostrarAlerta(
            'No se encontraron datos',
            'Opps!'
          );
      },
      error: (e) => {},
    });
  }
  ngOnInit(): void {
    this.obtenerClientes();
  }

  ngAfterViewInit(): void {
    this.dataListaCliente.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaCliente.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoCliente() {
    this.dialog
      .open(ModalClienteComponent, {
        disableClose: true,
        width: '40svw',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'true') this.obtenerClientes();
      });
  }

  editarCliente(cliente: Cliente) {
    this.dialog
      .open(ModalClienteComponent, {
        disableClose: true,
        data: cliente,
        width: '40svw',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado === 'true') this.obtenerClientes();
      });
  }

  eliminarClientes(cliente: Cliente) {
    Swal.fire({
      title: '¿Deseas eliminar el producto?',
      text: cliente.cedulaCliente,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No,volver',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._clienteServicio.eliminar(cliente.cedulaCliente).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta(
                'El Producto se elimino',
                'Listo!'
              );
              this.obtenerClientes();
            } else
              this._utilidadServicio.mostrarAlerta(
                'No se pudo eliminar el producto',
                'Error!'
              );
          },
          error: (e) => {},
        });
      }
    });
  }

}
