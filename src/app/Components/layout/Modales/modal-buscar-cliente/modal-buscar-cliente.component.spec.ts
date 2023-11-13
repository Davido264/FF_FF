import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBuscarClienteComponent } from './modal-buscar-cliente.component';

describe('ModalBuscarClienteComponent', () => {
  let component: ModalBuscarClienteComponent;
  let fixture: ComponentFixture<ModalBuscarClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBuscarClienteComponent]
    });
    fixture = TestBed.createComponent(ModalBuscarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
