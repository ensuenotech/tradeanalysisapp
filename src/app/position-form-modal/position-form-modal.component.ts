import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { predicateBy } from '../utilities/utils';
import moment from 'moment';
import { TradeService } from '../services/trade.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-position-form-modal',
  templateUrl: './position-form-modal.component.html',
  styleUrl: './position-form-modal.component.css'
})
export class PositionFormModalComponent {
  @Input() isFormOpen: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter();
  @Output() saveData: EventEmitter<any> = new EventEmitter(); // Emits the form data
    tradeList:any=[]
    loading: boolean = false;  // Loader state
    positionForm: FormGroup;
    showSearchList: boolean = false;  // To toggle search list visibility
    // symbolList: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];  // Example symbol list
    filteredSymbols: any =[]; // Filtered list for searching

    timeout: any; // Variable to store timeout reference

    constructor(private fb: FormBuilder,private tradeService:TradeService) {
      // Initialize the form with the necessary controls
      this.positionForm = this.fb.group({
        sellAvg: ['', [Validators.required, Validators.min(0)]],
        sellQuantity: ['', [Validators.required, Validators.min(0)]],
        buyAvg: ['', [Validators.required, Validators.min(0)]],
        buyQuantity: ['', [Validators.required, Validators.min(0)]],
        ltp: ['', [Validators.required, Validators.min(0)]],
        orderType: ['', Validators.required],
        pAndL: ['', [Validators.required, Validators.min(0)]],
        symbol: ['', Validators.required],
        userId: ['', Validators.required],
        updatedOn: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(0)]],
        expiry: ['', Validators.required],
        strategy: ['', Validators.required],
        strike: ['', Validators.required],
        exchange: ['', Validators.required],
        instrumentType: ['', Validators.required]
      });
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
  
  // Set the selected symbol in the form
  selectSymbol(symbol: string) {
    this.positionForm.patchValue({ symbol });
    this.showSearchList = false;  // Close the search list after selection
  }

  // Close the form modal
  closeForm() {
    this.closeModal.emit();
  }

  // Submit the form and emit the data
  
    onSave(): void {
      // debugger
      if (this.positionForm.valid) {
        this.loading = true; // Show loader
    
        const formData = this.positionForm.value;
        console.log('Form Data as JSON:', formData); // Console log the JSON
    
        // Simulating an API call or saving process with setTimeout
        setTimeout(() => {
          this.saveData.emit(formData); // Emit the form data as JSON to the parent component
          this.closeForm(); // Optionally close the form after saving
          this.loading = false; // Hide the loader once the save operation is done
    
          // Show success alert
          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'Your form data has been saved successfully.',
            confirmButtonText: 'OK'
          });
        }, 2000); // Simulate a 2-second delay
      } 
      else
       {
        console.log('Form is invalid');
        
        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Please fill in all required fields.',
          confirmButtonText: 'OK'
        });
      }
  }
  
  // Getters to easily access the form controls in the template
  get f() {
    return this.positionForm.controls;
  }
}