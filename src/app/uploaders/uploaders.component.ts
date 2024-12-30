import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-uploaders',
  templateUrl: './uploaders.component.html',
  styleUrl: './uploaders.component.css'
})
export class UploadersComponent {
  suppliers:any = [];
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
    // private services: Services,
    // private authService: AuthService,
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
            SellAvg: curruntRecord[0]?.toString().trim(),
            SellQuantity: curruntRecord[1]?.toString().trim(),
            BuyAvg: curruntRecord[2]?.toString().trim(),
            BuyQuantity: curruntRecord[3]?.toString().trim(),
            Ltp: curruntRecord[4]?.toString().trim(),
            OrderType: curruntRecord[5]?.toString().trim(),
            PAndL: curruntRecord[6]?.toString().trim(),
            Symbol: curruntRecord[7]?.toString().trim(),
            UserId: curruntRecord[8]?.toString().trim(),
            UpdatedOn: curruntRecord[9]?.toString().trim(),
            Quantity: curruntRecord[10]?.toString().trim(),
            Expiry: curruntRecord[11]?.toString().trim(),
            Strategy: curruntRecord[12]?.toString().trim(),
            // ManagerUserId: this.managerUserId,
            Strike: curruntRecord[13]?.toString().trim(),
           
          };
          this.records.push(csvRecord);
        });
        // console.log(this.records, XL_row_object)

        //#endregion
      };
    };

    return;
  
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
  importFile(){

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
              OrderType: curruntRecord[0]?.toString().trim(),
              Quantity: curruntRecord[1]?.toString().trim(),
              Price: curruntRecord[2]?.toString().trim(),
              TriggerPrice: curruntRecord[3]?.toString().trim(),
              RateType: curruntRecord[4]?.toString().trim(),
              Status: curruntRecord[5]?.toString().trim(),
              Symbol: curruntRecord[6]?.toString().trim(),
              Time: curruntRecord[7]?.toString().trim(),
              OperationType: curruntRecord[8]?.toString().trim(),
              UserId: curruntRecord[9]?.toString().trim(),
              Guid: curruntRecord[10]?.toString().trim(),
              BasketId: curruntRecord[11]?.toString().trim(),
              Expiry: curruntRecord[12]?.toString().trim(),
              BOGUID: curruntRecord[13]?.toString().trim(),
              TargetPrice: curruntRecord[14]?.toString().trim(),
              Strategy: curruntRecord[15]?.toString().trim(),
              Strike: curruntRecord[16]?.toString().trim(),

             
            };
            this.Orderrecords.push(csvRecord);
          });
          // console.log(this.Orderrecords, XL_row_object)
  
          //#endregion
        };
      };
  
      return;
    }
  }

