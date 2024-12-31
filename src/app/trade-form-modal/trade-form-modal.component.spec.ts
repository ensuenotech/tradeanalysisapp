import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeFormModalComponent } from './trade-form-modal.component';

describe('TradeFormModalComponent', () => {
  let component: TradeFormModalComponent;
  let fixture: ComponentFixture<TradeFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeFormModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
