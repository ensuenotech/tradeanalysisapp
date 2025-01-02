import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { TradeService } from '../services/trade.service';
@Component({
  selector: 'app-uploaders',
  templateUrl: './uploaders.component.html',
  styleUrl: './uploaders.component.css'
})
export class UploadersComponent {
  suppliers:any = [];
  isTradeFormOpen:boolean=false;
  // isFormOpen: boolean = false;
  isFormOpen: boolean = false;
  suppliersWithFeed = [];
  loading = false;
  valuesForm = this.fb.group({
    supplierId: new FormControl("", [Validators.required]),
  });
  valuesForm2 = this.fb.group({
    supplierId: new FormControl("", [Validators.required]),
  });
  // managerUserId = parseInt(this.authService.getUserId());
  Orderrecords:any=[]
  records:any = [];
  constructor(
    private tradeService: TradeService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}
  uploadListener($event: any): void {
    let input = $event.target;
    let reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      let file = $event.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        let arrayBuffer: any = fileReader.result;
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];

        var worksheet = workbook.Sheets[first_sheet_name];
        let XL_row_object: any = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
        });
        // this.records = this.getDataRecordsArrayFromCSVFile(XL_row_object, Object.keys(XL_row_object[0]).length)
        // console.log(this.records, Object.keys(XL_row_object[0]).length)
        XL_row_object.forEach((x: any, index: number) => {
          let curruntRecord: any = Object.values(x);
          for (var i = 0; i <= 13; i++) {
            if (!curruntRecord[i]?.toString().trim()) {
              console.log(
                "EMPTY",
                i,
                curruntRecord,
                curruntRecord[i]?.toString().trim()
              );
              alert("Empty columns not allowed. Please check data");
              return;
            }
          }

          let csvRecord: any = {
            Exchange: curruntRecord[0]?.toString().trim(),           // Column 1: Exchange
            InstrumentType: curruntRecord[1]?.toString().trim(),     // Column 2: Instrument type
            Symbol: curruntRecord[2]?.toString().trim(),             // Column 3: Symbol
            OrderType: curruntRecord[3]?.toString().trim(),          // Column 4: OrderType
            Strategy: curruntRecord[4]?.toString().trim(),           // Column 5: Strategy
            Expiry: curruntRecord[5]?.toString().trim(),             // Column 6: Expiry
            Strike: curruntRecord[6]?.toString().trim(),             // Column 7: Strike
            SellAvg: curruntRecord[7]?.toString().trim(),            // Column 8: SellAvg
            SellQuantity: curruntRecord[8]?.toString().trim(),       // Column 9: SellQuantity
            BuyAvg: curruntRecord[9]?.toString().trim(),             // Column 10: BuyAvg
            BuyQuantity: curruntRecord[10]?.toString().trim(),       // Column 11: BuyQuantity
            Ltp: curruntRecord[11]?.toString().trim(),               // Column 12: Ltp
            Quantity: curruntRecord[12]?.toString().trim(),          // Column 13: Quantity
            PAndL: curruntRecord[13]?.toString().trim(),             // Column 14: PAndL
            Date: curruntRecord[14]?.toString().trim(),              // Column 15: Date
          };
          
          this.records.push(csvRecord);
        });
        // this.importFile();
        // console.log("this.positionrecords",this.records, XL_row_object)

        //#endregion
      };
    };

    return;
  
  }
  importPositionFile(): void {
    const jsonString = JSON.stringify(this.records, null, 2);
    // console.log("Position JSON:", jsonString); // Log the raw position data for debugging
    
    const userId = this.authService.getUserId();
  
    // Correctly formatted `formattedPositionData`
    const formattedPositionData = {
      userId: userId,
      positions: this.records.map((position: any) => ({
        // id: 0, // Default or dynamically assigned ID if needed
        buyAvg: position.BuyAvg,
        sellAvg: position.SellAvg,
        ltp: position.Ltp,
        orderType: position.OrderType,
        pandL: position.PandL, // Assuming `pAndL` is the field in the form
        buyQuantity: position.BuyQuantity,
        sellQuantity: position.SellQuantity,
        symbol: position.Symbol,
        // userId: userId,
        // guid: "", // Assuming guid is to be generated dynamically
        // boguid: "", // Assuming boguid is to be generated dynamically or required in the form
        // basketId: 0, // Default or dynamically assigned value if needed
        strike: position.Strike,
        // expiry: new Date(position.Expiry), // Assuming expiry is a date string, converting it to ISO format
        // time: new Date(position.Time), // Assuming time is a date string, converting it to ISO format
        exchange: position.Exchange,
        instrumentType: position.InstrumentType
      }))
    };
  
    // Logging the formatted position data for debugging
    // console.log('Formatted Position Data:', JSON.stringify(formattedPositionData, null, 2));
  
    // Now you can send the formatted position data to the backend
    this.tradeService.submitPosition(formattedPositionData).subscribe((response:any) => {
      if (response) {
        Swal.fire({
          title: 'Success',
          text: 'Position submitted successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Optionally close the dialog/modal (if it's a modal dialog)
          // this.closePositionForm();  // Uncomment this line if you want to close the modal
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
  }
  
  export2() {
  //   if (this.valuesForm2.valid) {
  //     this.loading = true;
  //     this.services
  //       .ExportProducts(this.valuesForm2.controls.supplierId.value)
  //       .subscribe((res: any) => {
  //         this.loading = false;
  //         window.open(res);
  //       });
  //   } else {
  //     Swal.fire("*Required", "Please choose a supplier to continue", "error");
  //   }
  // }
  }
  importFile(): void {
    // debugger;
    const jsonString = JSON.stringify(this.Orderrecords, null, 2);
    // console.log(jsonString); // Log the JSON to the console
  
    const userId = this.authService.getUserId();
  
    // Correctly formatted `formattedTradeData`
    const formattedTradeData = {
      userId: userId,
      list: this.Orderrecords.map((trade: any) => ({
        
        id: 0, // Default or dynamically assigned ID if needed
        orderType: trade.OrderType,
        quantity: trade.Quantity,
        price: trade.Price,
        triggerPrice: trade.TriggerPrice,
        stopLoss: 0, // Assuming no stop loss in current data
        targetPrice: 0, // Assuming no target price in current data
        rateType: trade.RateType,
        status: trade.Status,
        strategy: trade.Strategy,
        symbol: trade.Symbol,
        operationType: trade.OperationType,
        userId: userId,
        guid: "", // Assuming guid is to be generated dynamically
        boguid: "", // Assuming boguid is to be generated dynamically or required in the form
        basketId: 0, // Default or dynamically assigned value if needed
        strike: trade.Strike,
        // expiry: new Date(trade.Expiry), // Assuming expiry is a date string, converting it to ISO format
        // time: new Date(trade.Time), // Assuming time is a date string, converting it to ISO format
        exchange: trade.Exchange,
        instrumentType: trade.InstrumentType
      }))
    };
  
    // Logging the individual formatted trade data for each trade (for debugging)
    // console.log('Formatted Trade Data:', JSON.stringify(formattedTradeData, null, 2));
  
    // Now you can send the formatted trade data to the backend
    this.tradeService.submitTrade(formattedTradeData).subscribe(response => {
      if (response) {
        Swal.fire({
          title: 'Success',
          text: 'Trade submitted successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Optionally close the dialog/modal (if it's a modal dialog)
          // this.closeTradeForm();  // Uncomment this line if you want to close the modal
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
  }
  
 
  uploadListenerOrder($event: any): void {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let file = $event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
          let arrayBuffer: any = fileReader.result;
          var data = new Uint8Array(arrayBuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i)
            arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          var workbook = XLSX.read(bstr, { type: "binary" });
          var first_sheet_name = workbook.SheetNames[0];
  
          var worksheet = workbook.Sheets[first_sheet_name];
          let XL_row_object: any = XLSX.utils.sheet_to_json(worksheet, {
            raw: true,
          });
          // this.records = this.getDataRecordsArrayFromCSVFile(XL_row_object, Object.keys(XL_row_object[0]).length)
          // console.log(this.records, Object.keys(XL_row_object[0]).length)
          XL_row_object.forEach((x: any, index: number) => {
            let curruntRecord: any = Object.values(x);
            let emptyFieldFound = false; // Flag to track if any empty field is found

            for (var i = 0; i <= 14; i++) {
              if (!curruntRecord[i]?.toString().trim()) {
                console.log(
                  "EMPTY",
                  i,
                  curruntRecord,
                  curruntRecord[i]?.toString().trim()
                );
            
                if (!emptyFieldFound) {
                  alert("Empty columns not allowed. Please check data");
                  emptyFieldFound = true;  // Set flag to true to prevent multiple alerts
                }
            
                return;  // Exit the loop early after showing the alert
              }
            }
            
            let csvRecord: any = {
              Exchange: curruntRecord[0]?.toString().trim(),       // Column 1: Exchange
              InstrumentType: curruntRecord[1]?.toString().trim(), // Column 2: Instrument Type
              Symbol: curruntRecord[2]?.toString().trim(),         // Column 3: Symbol
              Strike: curruntRecord[3]?.toString().trim(),         // Column 4: Strike
              Expiry: curruntRecord[4]?.toString().trim(),         // Column 5: Expiry
              Strategy: curruntRecord[5]?.toString().trim(),       // Column 6: Strategy
              OrderType: curruntRecord[6]?.toString().trim(),      // Column 7: OrderType
              RateType: curruntRecord[7]?.toString().trim(),       // Column 8: RateType
              OperationType: curruntRecord[8]?.toString().trim(),  // Column 9: OperationType
              Quantity: curruntRecord[9]?.toString().trim(),       // Column 10: Quantity
              Price: curruntRecord[10]?.toString().trim(),         // Column 11: Price
              TriggerPrice: curruntRecord[11]?.toString().trim(),  // Column 12: TriggerPrice
              Status: curruntRecord[12]?.toString().trim(),        // Column 13: Status
              Date: curruntRecord[13]?.toString().trim(),          // Column 14: Date
              Time: curruntRecord[14]?.toString().trim(),          // Column 15: Time
              StopLoss: curruntRecord[15]?.toString().trim(),      // Column 16: StopLoss
              TargetPrice: curruntRecord[16]?.toString().trim(),   // Column 17: TargetPrice
            };
            this.Orderrecords.push(csvRecord);
          });
          // console.log("this.orderrecords",this.Orderrecords, XL_row_object)
  
          //#endregion
        };
      };
  
      return;
    }
     // Method to open the form
  openPositionForm() {
    this.isFormOpen = true;
  }
  closeForm() {
    this.isFormOpen = false;
  }
  closeTradeForm() {
    this.isTradeFormOpen = false;
  }
  onSaveData(data: any) {
    // console.log('Received form data as JSON:', data);
    // You can perform further actions with this JSON data, such as saving to a database or sending to an API
  }
  openTradeForm(){
    this.isTradeFormOpen = true;
  }
  onSaveTtradeData(data:any){
    // console.log('Received form data as JSON:', data);
  }
   
  }

