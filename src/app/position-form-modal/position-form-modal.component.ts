import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { predicateBy } from '../utilities/utils';
import moment from 'moment';
import { TradeService } from '../services/trade.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-position-form-modal',
  templateUrl: './position-form-modal.component.html',
  styleUrl: './position-form-modal.component.css'
})
export class PositionFormModalComponent {
  userId:any;
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

    constructor(private fb: FormBuilder,private tradeService:TradeService,private authSevice:AuthService) {
      // Initialize the form with the necessary controls
      this.positionForm = this.fb.group({
        exchange: ['', Validators.required],
        instrumentType: ['', Validators.required],
        symbol: ['', Validators.required],
        orderType: ['', Validators.required],
        strategy: ['', Validators.required],
        expiry: ['', Validators.required],
        strike: ['', [Validators.required, Validators.min(0)]],
        sellAvg: ['', [Validators.required, Validators.min(0)]],
        sellQuantity: ['', [Validators.required, Validators.min(1)]],
        buyAvg: ['', [Validators.required, Validators.min(0)]],
        buyQuantity: ['', [Validators.required, Validators.min(1)]],
        ltp: ['', [Validators.required, Validators.min(0)]],
        quantity: ['', [Validators.required, Validators.min(1)]],
        pAndL: ['', [Validators.required]],
        updatedOn: ['', Validators.required]
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
        if (this.positionForm.valid) {
          this.userId = this.authSevice.getUserId();
          
          // Mapping the form values to the required structure
          const formValues = this.positionForm.value;
          
          const positionData = {
            userId: this.userId,
            positions: [
              {
                id: 0,  // Set a default or fetch dynamically if needed
                buyAvg: formValues.buyAvg,
                sellAvg: formValues.sellAvg,
                ltp: formValues.ltp,
                orderType: formValues.orderType,
                pandL: formValues.pAndL,  // Renamed from `pAndL` in the form
                buyQuantity: formValues.buyQuantity,
                sellQuantity: formValues.sellQuantity,
                symbol: formValues.symbol,
                userId: this.userId,
                // Assuming the `id` field is auto-generated by the backend, otherwise, you can set it dynamically if needed.
              }
            ]
          };
          
          // Logging the final object for reference (optional)
          // console.log('Formatted Position Data:', JSON.stringify(positionData, null, 2));
      
          // Send this object to the backend or API
          this.tradeService.submitPosition(positionData).subscribe(response => {
            if (response) {
              // Show success alert with SweetAlert and close the dialog on "OK"
              Swal.fire({
                title: 'Success',
                text: 'Position submitted successfully',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                // Optionally close the dialog/modal (if it's a modal dialog)
                this.closePositionForm();  // Assuming `this.dialog.close()` is used to close the dialog/modal
                // console.log('Position submitted successfully', response);
              });
            }
          }, (error:any) => {
            console.error('Error submitting position', error);
            Swal.fire({
              title: 'Error',
              text: 'There was an error submitting your position.',
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
      
      closePositionForm(){
        this.closeModal.emit();
      }

  // Getters to easily access the form controls in the template
  get f() {
    return this.positionForm.controls;
  }
}