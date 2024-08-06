import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOperatorComponent } from './register-operator.component';

describe('RegisterOperatorComponent', () => {
  let component: RegisterOperatorComponent;
  let fixture: ComponentFixture<RegisterOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterOperatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
