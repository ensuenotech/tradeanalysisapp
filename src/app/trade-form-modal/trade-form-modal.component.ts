import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TradeService } from '../services/trade.service';
import moment from 'moment';

@Component({
  selector: 'app-trade-form-modal',
  templateUrl: './trade-form-modal.component.html',
  styleUrl: './trade-form-modal.component.css'
})
export class TradeFormModalComponent {
@Input() isTradeFormOpen: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() saveData: EventEmitter<any> = new EventEmitter(); // Emits the form data
   tradeList:any=[]
    loading: boolean = false;  // Loader state
    tradeForm: FormGroup;
    showSearchList: boolean = false;  // To toggle search list visibility
    // symbolList: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];  // Example symbol list
    filteredSymbols: any =[]; // Filtered list for searching
  
    timeout: any; // Variable to store timeout reference
  
    constructor(private fb: FormBuilder,private tradeService:TradeService) {
      // Initialize the form with the necessary controls
      this.tradeForm = this.fb.group({
        orderType: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(0)]],
        triggerPrice: ['', [Validators.required, Validators.min(0)]],
        rateType: ['', Validators.required],
        status: ['', Validators.required],
        symbol: ['', Validators.required],
        time: ['', Validators.required],
        operationType: ['', Validators.required],
        userId: ['', Validators.required],
        guid: ['', Validators.required],
        basketId: ['', Validators.required],
        expiry: ['', Validators.required],
        boguid: ['', Validators.required],
        stopLoss: ['', [Validators.required, Validators.min(0)]],
        targetPrice: ['', [Validators.required, Validators.min(0)]],
        strategy: ['', Validators.required],
        strike: ['', [Validators.required, Validators.min(0)]]
      });
    }
    onSave() {
      if (this.tradeForm.valid) {
        console.log('Trade Data:', this.tradeForm.value);
        // Handle save action here
      } else {
        console.log('Form is invalid');
      }
    }
    closeTradeForm(){
      this.closeModal.emit();
    }
    // Set the selected symbol in the form
   selectSymbol(symbol: string) {
    this.tradeForm.patchValue({ symbol });
    this.showSearchList = false;  // Close the search list after selection
  }
   search(event: any) {
      const searchTerm = event.target.value.trim();
  
      // Only trigger search if input length is >= 3 characters
      // if (searchTerm.length < 3) {
      //   this.filteredSymbols = this.symbolList; // Reset to full list if less than 3 chars
      //   this.showSearchList = false;  // Hide the search list if input is too short
      //   return;
      // }
  
      // Clear the previous timeout to avoid multiple unnecessary calls
      window.clearTimeout(this.timeout);
  
      // Set a new timeout to debounce the search
      this.timeout = window.setTimeout(
        () => this.constructNewGrid(searchTerm),
        500 // 500ms delay before executing the search
      );
    }
   
    constructNewGrid(searchTerm: string): void {
      this.tradeService.getSymbols(searchTerm).subscribe((res: any) => {
        const currentDate = moment().startOf('day');
    
        // Filter by expiry date - keep only symbols with expiry on or after today
        res = res.filter((x: any) => moment(x.expiry).isSameOrAfter(currentDate));
    
        // Filter based on the search term
        res = res.filter((x: any) => 
          x.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          x.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
          x.tradingSymbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        // Sort first by symbolId, then by expiry
        res.sort((a: any, b: any) => {
          const symbolIdComparison = a.symbolId - b.symbolId;
          if (symbolIdComparison !== 0) return symbolIdComparison;
          return moment(a.expiry).isBefore(moment(b.expiry)) ? -1 : 1;
        });
    
        // Update the filtered symbols list with the first 25 results
        this.filteredSymbols = res.slice(0, 15).map((x: any) => x.symbol);  // Assuming symbol is the key to show
        // console.log(this.filteredSymbols);  // Check the filtered list in the console
    
        // Show the search list if there are results
        this.showSearchList = this.filteredSymbols.length > 0;
      });
    }
}
