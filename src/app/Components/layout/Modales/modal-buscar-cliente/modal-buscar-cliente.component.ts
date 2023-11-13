import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Cliente } from 'src/app/Interfaces/cliente';
import { ClientesService } from 'src/app/Services/clientes.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { ModalClienteComponent } from '../../Modales/modal-cliente/modal-cliente.component';

@Component({
  selector: 'app-modal-buscar-cliente',
  templateUrl: './modal-buscar-cliente.component.html',
  styleUrls: ['./modal-buscar-cliente.component.css']
})
export class ModalBuscarClienteComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = [
    'cedula',
    'nombres',
    'direccion',
    'correo',
  ];
  dataInicio: Cliente[] = [];
  dataListaClientes = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _clienteServicio: ClientesService,
    private _utilidadServicio: UtilidadService,
    private _dialogRef: MatDialogRef<ModalBuscarClienteComponent>,
  ) {}

  closeDialog(cancel: boolean, cliente?: Cliente) {
    if ((!cancel && cliente) || cliente) {
      this._dialogRef.close(cliente)
      return
    }
    this._dialogRef.close(undefined)
  }

  select(cliente: Cliente) {
    this.closeDialog(false,cliente)
  }

  obtenerClientes() {
    this._clienteServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.dataListaClientes.data = data.value;
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
    this.dataListaClientes.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaClientes.filter = filterValue.trim().toLocaleLowerCase();
  }
}
