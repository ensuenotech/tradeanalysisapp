import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOptions } from 'app/data/configData';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketWindowService {
  // TestUrl = "https://testapi.i4option.com/api/common/";
  ApiUrl = environment.coreAppURL + "/api/common/";
  // ApiUrl = environment.coreAppURL + "/api/common/";


  constructor(private http: HttpClient) { }
  getIndexActive() {
    return this.http.post(this.ApiUrl + "getindexactive", httpOptions)
  }
  getIndexFarActivity() {
    return this.http.post(this.ApiUrl + "getindexfaractivity", httpOptions)
  }
  getIndexOh() {
    return this.http.post(this.ApiUrl + "getindexoh", httpOptions)
  }
  getIndexOl() {
    return this.http.post(this.ApiUrl + "getindexol", httpOptions)
  }
  getIndexOIGainer() {
    return this.http.post(this.ApiUrl + "getindexoigainer", httpOptions)
  }
  getIndexOILooser() {
    return this.http.post(this.ApiUrl + "getindexoilooser", httpOptions)
  }
  getIndexBuyers() {
    return this.http.post(this.ApiUrl + "getindexbuyers", httpOptions)
  }
  getIndexWriters() {
    return this.http.post(this.ApiUrl + "getindexwriters", httpOptions)
  }
  getIndexItmUnwinding() {
    return this.http.post(this.ApiUrl + "indexItmUnwinding", httpOptions)
  }
  getStocksActive() {
    return this.http.post(this.ApiUrl + "getStocksactive", httpOptions)
  }
  getStocksFarActivity() {
    return this.http.post(this.ApiUrl + "getStocksfaractivity", httpOptions)
  }
  getStocksOh() {
    return this.http.post(this.ApiUrl + "getStocksoh", httpOptions)
  }
  getStocksOl() {
    return this.http.post(this.ApiUrl + "getStocksol", httpOptions)
  }
  getStocksOIGainer() {
    return this.http.post(this.ApiUrl + "getStocksoigainer", httpOptions)
  }
  getStocksOILooser() {
    return this.http.post(this.ApiUrl + "getStocksoilooser", httpOptions)
  }
  getStocksBuyers() {
    return this.http.post(this.ApiUrl + "getStocksbuyers", httpOptions)
  }
  getStocksWriters() {
    return this.http.post(this.ApiUrl + "getStockswriters", httpOptions)
  }
  getStocksItmUnwinding() {
    return this.http.post(this.ApiUrl + "stocksItmUnwinding", httpOptions)
  }
  
  // getTouchlineIndexWriting() {
  //   return this.http.post(this.ApiUrl + "gettouchlineindexwriting", httpOptions)
  // }
  // getFarActivity() {
  //   return this.http.post(this.ApiUrl + "getfaractivity", httpOptions)
  // }
  // getStockOptions() {
  //   return this.http.post(this.ApiUrl + "gettouchlineoption", httpOptions)
  // }
  // getIndexoption() {
  //   return this.http.post(this.ApiUrl + "gettouchlineindexoption", httpOptions)
  // }
}
