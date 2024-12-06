import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeAnalysisComponent } from './trade-analysis.component';

describe('TradeAnalysisComponent', () => {
  let component: TradeAnalysisComponent;
  let fixture: ComponentFixture<TradeAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TradeAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
