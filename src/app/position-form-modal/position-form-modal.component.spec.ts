import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionFormModalComponent } from './position-form-modal.component';

describe('PositionFormModalComponent', () => {
  let component: PositionFormModalComponent;
  let fixture: ComponentFixture<PositionFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionFormModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PositionFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
