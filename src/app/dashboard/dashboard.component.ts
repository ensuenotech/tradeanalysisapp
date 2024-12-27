// import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
// import { ServiceService } from '../services/service.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { getIST } from '../utilities/utils';
import { EventEmitter } from '@angular/core';
// import { TradeService } from '../services/trade.service';
// import { StrikeService } from '../services/strike.service';
import { EncService } from '../services/enc.service';
import * as _ from 'lodash';
// import {
//   ITouchlineDetails,
//   predicateBy,
//   predicateByDesc,
// } from '../models/trade.model';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
    // updateTarget() {
    //   this.userService
    //     .updateTarget({
    //       userId: this.userId,
    //       profit: this.InsertUserForm.controls['profit'].value,
    //       sl: this.InsertUserForm.controls['sl'].value,
    //     })
    //     .subscribe((res) => {
    //       Swal.fire('Sucess', '', 'success');
    //     });
    // }
    // updateTrail() {
    //   this.userService
    //     .updateTrail({
    //       userId: this.userId,
    //       trailBy: this.InsertUserForm.controls['trailBy'].value,
    //       trailAfter: this.InsertUserForm.controls['trailAfter'].value,
    //     })
    //     .subscribe((res) => {
    //       Swal.fire('Sucess', '', 'success');
    //     });
    // }
    checkTargetQuantities() {
      if (this.InsertUserForm.controls['profit'].value > 100) {
        this.InsertUserForm.controls['profit'].setValue(100);
      } else if (this.InsertUserForm.controls['profit'].value < 0) {
        this.InsertUserForm.controls['profit'].setValue(0);
      }
      if (this.InsertUserForm.controls['sl'].value < -15) {
        this.InsertUserForm.controls['sl'].setValue(-15);
      } else if (this.InsertUserForm.controls['sl'].value > 0) {
        this.InsertUserForm.controls['sl'].setValue(0);
      }
    }
    checkTrail() {
      if (this.InsertUserForm.controls['trailAfter'].value > 100) {
        this.InsertUserForm.controls['trailAfter'].setValue(100);
      } else if (this.InsertUserForm.controls['trailAfter'].value < 2) {
        this.InsertUserForm.controls['trailAfter'].setValue(2);
      }
    }
    @Output() public onUploadFinished = new EventEmitter();
    trades: any = [];
    pandl: any = [];
    editMode = false;
    payments: any[] = [];
    section = 'profile';
    renewMode = '';
    reportsSection = 'trade-history';
    userId!: number;
    // userData!: any;
    // userData:any={
    //   "userData": {
    //     "id": "12345",
    //     "firstName": "John",
    //     "lastName": "Doe",
    //     "mobile": "+1-800-555-1234",
    //     "email": "johndoe@example.com",
    //     "aadharNumber": "1234-5678-9101",
    //     "panNumber": "ABCDE1234F",
    //     "upi": "johndoe@upi",
    //     "address": {
    //       "address": "123 Main St",
    //       "city": "Somewhere",
    //       "state": "CA",
    //       "country": "USA",
    //       "pinCode": "90001"
    //     },
    //     "status": "ACTIVE"
    //   },
    //   "targetData": {
    //     "profit": 50,
    //     "sl": -10,
    //     "trailAfter": 20,
    //     "trailBy": 1
    //   }
    // }
    userData:any =[]
    
  
    InsertUserForm: FormGroup = this.fb.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      mobile: new FormControl(),
      email: new FormControl(),
      country: new FormControl(),
      state: new FormControl(),
      city: new FormControl(),
      address: new FormControl(),
      pincode: new FormControl(),
      aadharNumber: new FormControl(),
      panNumber: new FormControl(),
      bankAccount: new FormControl(),
      upi: new FormControl(),
      profit: new FormControl(),
      sl: new FormControl(),
      trailAfter: new FormControl(),
      trailBy: new FormControl('.5'),
    });
    pandlForm: FormGroup = this.fb.group({
      // selectedPandLToDate: new FormControl(moment(getIST()).format('YYYY-MM-DD')),
      // selectedPandLFromDate: new FormControl(
      //   moment(getIST()).add(-1, 'days').format('YYYY-MM-DD')
      // ),
    });
    payoutForm = this.fb.group({
      amount: new FormControl(0, [Validators.required]),
      // remarks: new FormControl('', [Validators.required]),
    });
    selectedDate = moment(getIST()).format('YYYY-MM-DD');
    loading: boolean = false;
    userDetails: any;
    allStateNames: any[] = [];
    countries: any[] = [];
    isAdmin = false;
    liveExpired = true;
    initialBalance: number = 0;
    runningBalance: number[] = [];
  
    constructor(
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private authService: AuthService,
      private userService: UserService,
      private router: Router,
      // private services: ServiceService,
      private encService: EncService,
      // private strikeService: StrikeService,
      // private tradeService: TradeService
    ) {}
    showMenu = false;
    ngOnInit(): void {
      this.userService.GetCountries().subscribe((res: any) => {
        this.countries = res;
      });
      this.userService.GetStates(1).subscribe((res: any) => {
        this.allStateNames = res;
      });
      this.route.paramMap.subscribe((params: any) => {
        const section = params.get('section');
        if (section != undefined) {
          this.section = section;
        }
      });
      this.userId = this.authService.getUserId();
      this.getPayouts();
      this.userId = this.authService.getUserId();
      this.userService.getProfile(this.userId).subscribe(
        (r: any) => {
          this.userData = r
          this.InsertUserForm.get('firstName')?.setValue(r.firstName);
          this.InsertUserForm.get('lastName')?.setValue(r.lastName);
          this.InsertUserForm.get('email')?.setValue(r?.email);
          this.InsertUserForm.get('mobile')?.setValue(r?.mobile);
          this.InsertUserForm.get('state')?.setValue(r?.address?.stateId);
          this.InsertUserForm.get('socialProfileName')?.setValue(
            r?.socialProfileName
          );
  
          this.InsertUserForm.get('country')?.setValue(r?.address?.countryId);
          this.InsertUserForm.get('address')?.setValue(r?.address?.address);
          this.InsertUserForm.get('pincode')?.setValue(r?.address?.pinCode);
          this.InsertUserForm.get('city')?.setValue(r?.address?.city);
        },
        (error:any) => console.log(error),
        () => {
          this.loading = false;
        }
      );
      // this.userData = ''
      // this.userService.getProfile(this.userId).subscribe((res: any) => {
      //   this.userData = res;
  
      //   if (new Date(this.userData.planExpireDate) >= getIST())
      //     this.liveExpired = false;
      // });
      // if (this.userService.userDetails == undefined) {
      //   this.userService.getUserDetails(this.userId).subscribe((r: any) => {
      //     this.userDetails = r;
  
      //     this.userService.userDetails = r;
      //     this.payments = r.userPayments;
  
      //     this.InsertUserForm.controls['profit'].setValue(r.target?.profit);
      //     this.InsertUserForm.controls['sl'].setValue(r.target?.sl);
      //     this.InsertUserForm.controls['trailBy'].setValue(r.trail?.trailBy);
      //     this.InsertUserForm.controls['trailAfter'].setValue(
      //       r.trail?.trailAfter
      //     );
      //   });
      // } else {
      //   this.payments = this.userDetails?.userPayments;
      // }
      // this.strikeService.getStocks().subscribe((res: any) => {
      //   this.stockList = res;
      //   this.getOrderList(this.selectedDate);
      // });
    }
    logout() {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userStatus');
  
      this.router.navigateByUrl('');
    }
  
    changeRenewMode(mode: string) {
      this.renewMode = mode;
      if (mode == 'i4option') {
      } else {
      }
    }
    handleSort(orderBy: string, event: any) {
      // Toggle sorting direction icons
      event.target.children[0].classList.toggle('fa-caret-down');
      event.target.children[0].classList.toggle('fa-caret-up');
    
      // Get the current sort order from the data-sort attribute
      const order = event.target.attributes['data-sort'].value;
    
      // Toggle between 'asc' and 'desc'
      if (order === 'desc') {
        event.target.attributes['data-sort'].value = 'asc';
        // Sort in ascending order based on the 'createdOn' field
        this.ledger.sort((a: any, b: any) => this.predicateBy(a, b, orderBy));
      } else {
        event.target.attributes['data-sort'].value = 'desc';
        // Sort in descending order based on the 'createdOn' field
        this.ledger.sort((a: any, b: any) => this.predicateByDesc(a, b, orderBy));
      }
    
      // After sorting, recalculate the balances
      // this.updateBalances();
    }
    
    // Sorting function for ascending order
    predicateBy(a: any, b: any, orderBy: string) {
      return new Date(a[orderBy]).getTime() - new Date(b[orderBy]).getTime();
    }
    
    // Sorting function for descending order
    predicateByDesc(a: any, b: any, orderBy: string) {
      return new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime();
    }
    
    // Function to recalculate the balances after sorting
    updateBalances() {
      let balance = 0;
    
      // Iterate over the sorted ledger and calculate the balance
      this.ledger.forEach((item: any) => {
        balance += item.amount;  // Add the transaction amount to the balance
        item.balance = balance;  // Store the running balance in the 'balance' field
      });
    }
    updateTrail(){

    }
    updateTarget(){

    }
    payouts: any = [];
    getPayouts() {
      // this.userService.GetPayouts(this.userId).subscribe((res) => {
      //   this.payouts = res;
      // });
    }
    savepayout() {
      // if (this.payoutForm.valid && this.payoutForm.controls.amount.value) {
      //   var request: IPayoutRequest = {
      //     amount: this.payoutForm.controls.amount.value,
      //     remarks: '',
      //     userId: this.userId,
      //   };
      //   this.userService.savePayout(request).subscribe((res) => {
      //     Swal.fire('Success', '', 'success');
      //     this.getPayouts();
      //   });
      // } else {
      //   Swal.fire('*Requiered', 'Please fill int he required fields', 'error');
      // }
    }
    loadUserDetails() {
      this.editMode = true;
      // this.loading = true;
      // this.userService.getProfile(this.userId).subscribe(
      //   (r: any) => {
      //     this.InsertUserForm.get('firstName')?.setValue(r.firstName);
      //     this.InsertUserForm.get('lastName')?.setValue(r.lastName);
      //     this.InsertUserForm.get('email')?.setValue(r?.email);
      //     this.InsertUserForm.get('mobile')?.setValue(r?.mobile);
      //     this.InsertUserForm.get('state')?.setValue(r?.address?.stateId);
      //     this.InsertUserForm.get('aadharNumber')?.setValue(r?.aadharNumber);
      //     this.InsertUserForm.get('panNumber')?.setValue(r?.panNumber);
      //     this.InsertUserForm.get('bankAccount')?.setValue(r?.bankAccount);
      //     this.InsertUserForm.get('upi')?.setValue(r?.upi);
      //     this.aadhar = r?.aadhar;
      //     this.pan = r?.panCard;
      //     this.cheque = r?.cancelledCheque;
      //     this.InsertUserForm.get('country')?.setValue(r?.address?.countryId);
      //     this.InsertUserForm.get('address')?.setValue(r?.address?.address);
      //     this.InsertUserForm.get('pincode')?.setValue(r?.address?.pinCode);
      //     this.InsertUserForm.get('city')?.setValue(r?.address?.city);
      //   },
      //   (error: any) => console.log(error),
      //   () => {
      //     this.loading = false;
      //   }
      // );
    }
  
    saveDetails() {
      if (this.InsertUserForm.valid) {
        let values: any = {
          id: this.userId,
          firstName: this.InsertUserForm.controls['firstName'].value,
          lastName: this.InsertUserForm.controls['lastName'].value,
          aadharNumber: this.InsertUserForm.controls['aadharNumber'].value,
          panNumber: this.InsertUserForm.controls['panNumber'].value,
          countryId: this.InsertUserForm.controls['country'].value,
          stateId: parseInt(this.InsertUserForm.controls['state'].value),
          city: this.InsertUserForm.controls['city'].value,
          mobile: this.InsertUserForm.controls['mobile'].value,
          email: this.InsertUserForm.controls['email'].value,
          address: this.InsertUserForm.controls['address'].value,
          pincode: this.InsertUserForm.controls['pincode'].value,
          panCard: this.pan,
          cancelledCheque: this.cheque,
          aadhar: this.aadhar,
          bankAccount: this.InsertUserForm.controls['bankAccount'].value,
          upi: this.InsertUserForm.controls['upi'].value,
        };
  
        this.userService.saveUserDetails(values).subscribe((res: any) => {
          if (res) {
            Swal.fire({
              title: 'Success',
              text: 'Success',
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              title: 'Failure',
              text: 'Enter valid data',
            });
          }
        });
      } else {
        Swal.fire({
          title: 'Required',
          text: 'All fields are required',
        });
      }
    }
    progress = 0;
    aadhar: string = '';
    pan: string = '';
    cheque: string = '';
    public uploadFile = (files: any, type: string) => {
      if (files.length === 0) {
        return;
      }
  
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
  
      // this.userService.UploadBlobFile(formData).subscribe(
      //   (event: any) => {
      //     if (event.type === HttpEventType.UploadProgress) {
      //       this.progress = Math.round((100 * event.loaded) / event.total);
      //     } else if (event.type === HttpEventType.Response) {
      //       var image = event.body;
      //       if (type == 'aadhar') this.aadhar = image;
      //       if (type == 'pan') this.pan = image;
      //       if (type == 'cheque') this.cheque = image;
      //       this.onUploadFinished.emit(event.body);
      //     }
      //   },
      //   (error) => {
      //     Swal.fire(
      //       'Oops !!',
      //       'There is some problem with the file you are trying to upload.',
      //       'error'
      //     );
      //   }
      // );
    };
    stockList: any = [];
    ledger: any = [];
    credits = 0;
    debits = 0;
    positions: any = [];
    chooseSection(event: any) {
      const selection = event.target.value;
      this.reportsSection = selection;
      if (selection == 'trade-history') {
        this.getOrderList(this.selectedDate);
      } else if (selection == 'pandl') {
        // this.tradeService
        //   .getPositions(
        //     this.userId,
        //     this.pandlForm.controls['selectedPandLFromDate'].value,
        //     this.pandlForm.controls['selectedPandLToDate'].value
        //   )
        //   .subscribe((res: any) => {
        //     this.positions = res;
        //   });
      } else 
      {
  //     if (selection == 'ledger' || selection == 'funds') {
  //       this.userService.getLedger(this.userId).subscribe((res: any) => {
  //         this.ledger = res;
  //        // Sort the ledger based on the createdOn date (ascending order)
  // this.ledger.sort(predicateBy('createdOn')); // You can use your sorting logic here
  
  
  // // Initialize balance
  // let balance = this.initialBalance || 0;  // Set initial balance to 0 if not defined
  
  // // Calculate the running balance for each transaction
  // this.ledger.forEach((transaction: any) => {
  //   balance += transaction.amount;  // Update balance with transaction amount
  //   transaction.balance = balance;  // Assign the calculated balance to 'balance' property of the transaction
  // });
  
  //         this.credits = _.sum(
  //           this.ledger.filter((x: any) => x.amount > 0).map((x: any) => x.amount)
  //         );
  //         this.debits = _.sum(
  //           this.ledger.filter((x: any) => x.amount < 0).map((x: any) => x.amount)
  //         );
  //       });
  //     }
    }
  }
    getBalance(index: number) {
      return _.sum(this.ledger.slice(0, index + 1).map((x: any) => x.amount));
    }
    async getOrderList(date: any) {
      if (this.userData) {
        var trades: any
        // var trades: any = await firstValueFrom(
        //   this.tradeService.allTrades(
        //     date,
        //     this.userId,
        //     this.userData?.allowNormalOrder ? 'normal' : 'mis'
        //   )
        // );
  
        trades.forEach((position: any) => {
          position.originalSymbol = Object.assign(position.symbol);
          position.pandl = position.pandL;
  
          if (position.strategy == 'straddle') {
            position.alias = `${position.symbol} ${moment(position.expiry)
              .format('MMM')
              .toUpperCase()} ${position.strike} SD`;
  
          } else {
            let optionString = position.symbol;
            let containsNumber = /\d/.test(optionString);
            if (containsNumber) {
              // Step 1: Extract the symbol (assuming the first part is always "FINNIFTY")
              
              let symbol = this.stockList.find((x: any) => 
                x.name == optionString.match(/[A-Za-z]+/)[0]
              )?.displayName; // This extracts all the letters until a number is encountered
  
              // Step 3: Extract the strike price (the next digits before "CE" or "PE")
              let strike = Number(
                optionString.match(/\d+(?=CE|PE)/)[0].substring(6)
              ); // Extracts the strike price digits before "CE" or "PE"
              position.strike = strike;
  
              // Step 4: Extract the option type (either "CE" or "PE")
              let optionType = optionString.match(/CE|PE/)[0]; // Extracts "CE" or "PE"
              position.alias = `${symbol} ${moment(position.expiry)
                .format('MMM')
                .toUpperCase()} ${strike} ${optionType}`;
  
              position.positionDistinguisher = `${symbol} ${moment(
                position.expiry
              )
                .format('YYMMDD')
                .toUpperCase()} ${strike} ${optionType}`;
            }
          }
  
        });
  
        this.trades = trades;
      }
     
    }
    changeDate(event: any) {
      var date = event.target.value;
      this.selectedDate = date;
      this.getOrderList(date);
    }
    changePandLDate() {
      // this.tradeService
      //   .getPositions(
      //     this.userId,
      //     this.pandlForm.controls['selectedPandLFromDate'].value,
      //     this.pandlForm.controls['selectedPandLToDate'].value
      //   )
      //   .subscribe((res: any) => {
      //     this.positions = res;
      //   });
    }
    getpnlsum() {
      return _.sum(
        this.positions.map((x: any) => {
          return x.pandL;
        })
      );
    }

}
