import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalProductosComponent } from '../../Modales/modal-productos/modal-productos.component';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {
  columnasTabla:string[]=['nombre','categoria','stock','precio','estado','acciones'];
  dataInicio:Producto[]=[];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator;

  constructor(
    private dialog:MatDialog,
    private _productoServicio : ProductoService,
    private _utilidadServicio : UtilidadService
  ){}


  obtenerProductos(){
    this._productoServicio.lista().subscribe({
      next:(data)=>{
       if(data.status) 
       this.dataListaProductos.data=data.value;
      else
      this._utilidadServicio.mostrarAlerta("No se encontraron datos","Opps!")
      },
      error:(e)=>{}
    })
  }
  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator= this.paginacionTabla;
  }

  aplicarFiltroTabla(event:Event){

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
  
}

nuevoProducto(){
  this.dialog.open(ModalProductosComponent,{
       
          disableClose: true
  }).afterClosed().subscribe(resultado =>{
    if(resultado === "true")this.obtenerProductos();

  })
}


editarProducto(producto:Producto){
  this.dialog.open(ModalProductosComponent,{
       
          disableClose: true,
          data:producto
  }).afterClosed().subscribe(resultado =>{
    if(resultado === "true")this.obtenerProductos();

  })
}

eliminarProductos(producto:Producto){
  Swal.fire({
    title: '¿Deseas eliminar el usuario?',
    text: producto.nombre,
    icon:"warning",
    confirmButtonColor:"#3085d6",
    confirmButtonText:"Si, eliminar",
    showCancelButton: true,
    cancelButtonColor:'#d33',
    cancelButtonText:'No,volver'
  }).then((resultado)=>{
    if(resultado.isConfirmed){
      this._productoServicio.eliminar(producto.idProducto).subscribe({
        next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El Producto se elimino","Listo!")
            this.obtenerProductos();
          }else
          this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto","Error!")
        },
        error:(e)=>{}
      })

    }
  })

}
}
