import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBusquedaProductosComponent } from './modal-busqueda-productos.component';

describe('ModalBusquedaProductosComponent', () => {
  let component: ModalBusquedaProductosComponent;
  let fixture: ComponentFixture<ModalBusquedaProductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBusquedaProductosComponent],
    });
    fixture = TestBed.createComponent(ModalBusquedaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
