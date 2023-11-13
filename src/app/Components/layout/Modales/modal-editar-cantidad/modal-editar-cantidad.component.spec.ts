import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarCantidadComponent } from './modal-editar-cantidad.component';

describe('ModalEditarCantidadComponent', () => {
  let component: ModalEditarCantidadComponent;
  let fixture: ComponentFixture<ModalEditarCantidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalEditarCantidadComponent]
    });
    fixture = TestBed.createComponent(ModalEditarCantidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
