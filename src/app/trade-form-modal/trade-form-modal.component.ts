import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TradeService } from '../services/trade.service';
import moment from 'moment';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
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
   userId:any;
    loading: boolean = false;  // Loader state
    tradeForm: FormGroup;
    showSearchList: boolean = false;  // To toggle search list visibility
    // symbolList: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];  // Example symbol list
    filteredSymbols: any =[]; // Filtered list for searching
  
    timeout: any; // Variable to store timeout reference
  
    constructor(private fb: FormBuilder,private tradeService:TradeService,private authService:AuthService) {
      // Initialize the form with the necessary controls
      this.tradeForm = this.fb.group({
        exchange: ['', Validators.required],
        instrumentType: ['', Validators.required],
        symbol: ['', Validators.required],
        strike: ['', [Validators.required, Validators.min(0)]],
        expiry: ['', Validators.required],
        strategy: ['', Validators.required],
        orderType: ['', Validators.required],
        rateType: ['', Validators.required],
        operationType: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(1)]],
        price: ['', [Validators.required, Validators.min(0)]],
        triggerPrice: ['', [Validators.required, Validators.min(0)]],
        status: ['', Validators.required],
        date: ['', Validators.required],
        time: ['', Validators.required],
        stopLoss: ['', [Validators.required, Validators.min(0)]],
        targetPrice: ['', [Validators.required, Validators.min(0)]],
        // userId: ['', Validators.required],
        // guid: ['', Validators.required],
        // basketId: ['', Validators.required],
        // boguid: ['', Validators.required],
      });
      
    }
    onSave() {
      if (this.tradeForm.valid) {
        this.userId = this.authService.getUserId();
      
        // Mapping the form values to the required structure
        const formValues = this.tradeForm.value;
        
        const tradeData = {
          userId: this.userId,
          list: [
            {
              id: 0, // Set a default or fetch dynamically if needed
              orderType: formValues.orderType,
              quantity: formValues.quantity,
              price: formValues.price,
              triggerPrice: formValues.triggerPrice,
              stopLoss: formValues.stopLoss, // Assuming this is in the form
              targetPrice: formValues.targetPrice, // Assuming this is in the form
              rateType: formValues.rateType,
              status: formValues.status,
              strategy: formValues.strategy,
              symbol: formValues.symbol,
              operationType: formValues.operationType,
              userId: this.userId,
              guid: formValues.guid, // Assuming `guid` is part of the form or elsewhere
              boguid: formValues.boguid, // Assuming `boguid` is part of the form or elsewhere
              basketId: formValues.basketId || 0, // Assuming `basketId` is part of the form or elsewhere
              strike: formValues.strike,
              expiry: formValues.expiry, // Ensure it's a valid date if needed
              time: formValues.time, // Ensure it's in the correct date/time format
              exchange: formValues.exchange,  // Assuming `exchange` is part of the form
              instrumentType: formValues.instrumentType,  // Assuming `instrumentType` is part of the form
            },
          ]
        };
      
        // Logging the final object for reference
        // console.log('Formatted Trade Data:', JSON.stringify(tradeData, null, 2));
      
        // Send this object to the backend or API
        this.tradeService.submitTrade(tradeData).subscribe(response => {
          if (response) {
            // Show success alert with SweetAlert and close the dialog on "OK"
            Swal.fire({
              title: 'Success',
              text: 'Trade submitted successfully',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Optionally close the dialog/modal (if it's a modal dialog)
              this.closeTradeForm();  // Assuming `this.dialog.close()` is used to close the dialog/modal
              // console.log('Trade submitted successfully', response);
            });
          }
        }, error => {
          console.error('Error submitting trade', error);
          Swal.fire({
            title: 'Error',
            text: 'There was an error submitting your trade.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        });
      
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Form is invalid',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        // console.log('Form is invalid');
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
