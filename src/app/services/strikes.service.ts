import { HttpClient, HttpHeaders } from "@angular/common/http";
import { httpOptions, API_URL } from "app/data/configData";
import { LocalStorageService } from "./localStorage.service";

import { Injectable } from "@angular/core";
import * as moment from "moment";
import { Observable, of } from "rxjs";

import {
  IActiveOIRequest,
  IPCRByDateRequest,
  IPCRByIntervalRequest,
  IStockDetails,
} from "app/model/stocks.model";
import { getIST } from "app/utilities/utils";
import { EncService } from "./enc.service";
import { monthNames } from "app/data/constants";

@Injectable({
  providedIn: "root",
})
export class StrikesService {
  AllStockList = [];

  constructor(
    private localStorageService: LocalStorageService,
    private encService: EncService,
    private http: HttpClient
  ) {
    // if (this.AllStockList.length == 0)
    //   this.updateAllStockList()
  }

  // getStrikes() {
  //   return this.http.get(API_URL + `/api/common/getstocks`);
  // }

  // getStrikesDetails(id) {
  //   return this.http.get(API_URL + '/admin/stock/' + id, httpOptions);
  // }
  addCalendarDate(id, calendarId, date, active) {
    var data = {
      id: id,
      calendarId: calendarId,
      date: date,
      active: active,
    };
    return this.http.post(
      API_URL + "/api/common/savecalendardate",
      JSON.stringify(data),
      httpOptions
    );
  }
  getCalendars() {
    return this.http.get(API_URL + `/api/common/getcalendars`);
  }
  getCalendarsPost() {
    return this.http.post(API_URL + `/api/common/getcalendars`,null,httpOptions);
  }

  getStocks() {
    let key = "stocks";
    let stocks = this.localStorageService.get(key);
    // if (stocks != null) {
    //   let lastUpdated = this.localStorageService.get(`${key}time`)
    //   if (lastUpdated != null) {
    //     var lastUpdatedTime = new Date(this.encService.decrypt(lastUpdated))
    //     if (moment(lastUpdatedTime).add(1, "days").toDate() < getIST())
    //       return of(JSON.parse(this.encService.decrypt(stocks)))
    //   }
    // }
    // else {
    this.http.get(API_URL + `/api/common/getstocks`).subscribe((stocks) => {
      this.localStorageService.set(
        key,
        this.encService.encrypt(JSON.stringify(stocks))
      );
      this.localStorageService.set(
        `${key}time`,
        this.encService.encrypt(getIST().toDateString())
      );
    });
    // }
    return this.http.get(API_URL + `/api/common/getstocks`);
  }
  postNotification(data:any) {
    // debugger;
    return this.http.post(
      API_URL + `/api/Notification`,
      JSON.stringify(data),
      httpOptions
    );
  }
  getNotification(){
    return this.http.get(API_URL + `/api/Notification`);
  }
  deleteNotification(id:any) {

    return this.http.post(
      API_URL + "/api/Notification/Delete",
      JSON.stringify(id),
      httpOptions
    );

    // debugger;
    // return this.http.post(API_URL + "/api/Notification/Delete/" + id, httpOptions);
  }
 
  getSnapshot(symbol: string, time: any) {
    return this.http.post(
      API_URL + `/api/common/snapshot`,
      JSON.stringify({ symbol: symbol, time: time }),
      httpOptions
    );
  }
  getSnapshots(symbols: string[], time: any) {
    return this.http.post(
      API_URL + `/api/common/snapshots`,
      JSON.stringify({ symbols: symbols, time: time }),
      httpOptions
    );
  }
  getStockswithmpd() {
    return this.http.get(API_URL + `/api/common/getstockswithmpd`);
  }
  getExpiry() {
    return this.http.get(API_URL + `/api/common/getexpiry`);
  }
  getExpiryByCalendarId(calendarId: number) {
    return this.http.get(API_URL + `/api/common/getexpiry/` + calendarId);
  }
  getUserDetails(userId: number) {
    return this.http.post(API_URL + `/api/User/GetUserDetails/`, userId, httpOptions);
  }
  getMonthPaymentData(month:any) {
    // debugger;
    // return this.http.get(API_URL + `/api/Order/Payment/` + month);
    return this.http.post(
      API_URL + `/api/Order/Filter`,
      month,
      httpOptions
    );
  }
  getAllStates(id:any) {
      return this.http.get(API_URL + "/api/User/getstates/" + id);
    }
    getStatewiseData(state:any) {
      // debugger;
      // return this.http.get(API_URL + `/api/Order/Payment/` + month);
      return this.http.post(
        API_URL + `/api/Order/Filter`,
        state,
        httpOptions
      );
    }
    
  getDatefilterData(date:any) {
    return this.http.post(
      API_URL + `/api/Order/Filter`,
      date,
      httpOptions
    );
  }
  getFutureDashboard() {
    return this.http.post(
      API_URL + `/api/common/futuredashboard/`,
      httpOptions
    );
  }
  getOptionDashboard() {
    return this.http.get(
      API_URL + `/api/common/optiondashboard/`,
      httpOptions
    );
  }
  getTouchLine(symbols: string[]) {
    if (symbols.length > 0)
      return this.http.post(
        API_URL + `/api/common/gettouchline`,
        symbols,
        httpOptions
      );
    return null;
  }
  getTouchLine1Min(symbols: string[]) {
    if (symbols.length > 0)
      return this.http.post(
        API_URL + `/api/common/get1mintouchline`,
        symbols,
        httpOptions
      );
    return null;
  }
  getmaxpain(symbol: string[], expiry: Date, fromDate: Date, toDate: Date) {
    var values = {
      symbol: symbol,
      expiry: moment(expiry).format("yyyy-MM-DD"),
      from: moment(fromDate).format("yyyy-MM-DD HH:mm"),
      to: moment(toDate).format("yyyy-MM-DD HH:mm"),
    };
    return this.http.post(
      API_URL + "/api/common/getmaxpain",
      JSON.stringify(values),
      httpOptions
    );
  }
  // getTouchLine(symbols: string[]) {
  //   return this.http.post(API_URL + `/api/common/gettouchline`, symbols, httpOptions);

  // }

  getLotSize(stock: string, expiry: Date) {
    var values = {
      stock: stock,
      expiry: expiry,
    };
    return this.http.post(
      API_URL + `/api/common/getlotsize`,
      values,
      httpOptions
    );
  }
  // subscribeSymbols(symbols: string[]) {
  //   return this.http.post(API_URL + `/api/common/subscribesymbols`, JSON.stringify(symbols), httpOptions);

  // }
  getFullHistory(symbols: string[], from: any, to: any, interval: number) {
    var values = { symbols: symbols, from: from, to: to, interval: interval };
    return this.http.post(
      API_URL + `/api/common/getfullhistory`,
      values,
      httpOptions
    );
  }
  getHistory(symbols: string[], from: any, to: any, interval: number) {
    var values = { symbols: symbols, from: from, to: to, interval: interval };
    return this.http.post(
      API_URL + `/api/common/gethistoryapi`,
      values,
      httpOptions
    );
  }
  getOptionsTouchline(stock: string, expiry: Date) {
    return this.http.post(
      API_URL + "/api/common/optionstouchline",
      JSON.stringify({ symbol: stock, expiry: expiry }),
      httpOptions
    );
  }
  getFutureScalping(symbols: string[]) {
    return this.http.post(
      API_URL + `/api/common/fscalping`,
      JSON.stringify(symbols),
      httpOptions
    );
  }
  getActiveOI(values: IActiveOIRequest) {
    return this.http.post(
      API_URL + `/api/common/activeoi`,
      JSON.stringify(values),
      httpOptions
    );
  }
  getActiveVolume(values: IActiveOIRequest) {
    return this.http.post(
      API_URL + `/api/common/activevol`,
      JSON.stringify(values),
      httpOptions
    );
  }
  getPremiumDecay(values: IActiveOIRequest) {
    return this.http.post(
      API_URL + `/api/common/premiumdecay`,
      JSON.stringify(values),
      httpOptions
    );
  }
  getPcrByInterval(values: IPCRByIntervalRequest) {
    return this.http.post(
      API_URL + `/api/common/PcrByInterval`,
      JSON.stringify(values),
      httpOptions
    );
  }
  getIntradayPcr(values: IPCRByIntervalRequest) {
    return this.http.post(
      API_URL + `/api/common/intradaypcr`,
      JSON.stringify(values),
      httpOptions
    );
  }
  getPcrByDate(values: IPCRByDateRequest) {
    return this.http.post(
      API_URL + `/api/common/pcrbydate`,
      JSON.stringify(values),
      httpOptions
    );
  }
  getHistoryInterval(symbols: string[], from: any, to: any, interval: number) {
    var values = { symbols: symbols, from: from, to: to, interval: interval };
    return this.http.post(
      API_URL + `/api/common/gethistory`,
      values,
      httpOptions
    );
  }
  getTouchlineByDate(symbols: string[], fromDate: any, toDate: any) {
    var values = { symbols: symbols, fromdate: fromDate, todate: toDate };
    return this.http.post(
      API_URL + `/api/common/gettouchlinebydate`,
      values,
      httpOptions
    );
  }
  getStrikes(stockName: string, expiry, series) {
    var data = { stockname: stockName, expiry: expiry, series: series };
    return this.http.post(
      API_URL + "/api/common/getstrikes",
      data,
      httpOptions
    );
  }
  getSegments() {
    return this.http.get(API_URL + "/api/common/getsegments");
  }

  addStrike(
    id,
    type,
    displayName,
    depth,
    change,
    lotSize,
    calendarId,
    name,
    segmentIds,
    freeFloat
  ) {
    var data = {
      id: id,
      type: type,
      displayName: displayName,
      depth: depth,
      change: change,
      lotSize: lotSize,
      calendarId: calendarId,
      name: name,
      segmentIds: segmentIds,
      freeFloat: freeFloat,
    };
    return this.http.post(API_URL + "/api/common/savestock", data, httpOptions);
  }

  deleteStrike(id) {
    return this.http.post(
      API_URL + "/api/common/deletestock",
      JSON.stringify(id),
      httpOptions
    );
  }
  editStrike(id, details) {
    return this.http.put(API_URL + "/admin/stock/" + id, details, httpOptions);
  }

  getCommentary() {
    return this.http.post(API_URL + "/api/common/getcommentary", httpOptions);
  }
  getBreadth() {
    return this.http.post(API_URL + "/api/common/breadth", httpOptions);
  }
  getSpotCommentary() {
    return this.http.post(API_URL + "/api/common/spotcommentary", httpOptions);
  }
  getIvData(date) {
    return this.http.post(
      API_URL + "/api/common/getivdata",
      JSON.stringify(date),
      httpOptions
    );
  }
  getIvbyDate(symbol, fromDate, toDate) {
    return this.http.post(
      API_URL + "/api/common/getivdatabydate",
      JSON.stringify({
        symbol: symbol,
        fromDate: fromDate,
        toDate: toDate,
      }),
      httpOptions
    );
  }
  //BEFORE getivhistory is like this
  // getIvHistory(symbols, fromDate, toDate) {
  //   return this.http.post(
  //     API_URL + "/api/common/getivhistory",
  //     JSON.stringify({
  //       symbols: symbols,
  //       fromDate: fromDate,
  //       toDate: toDate
  //     }),
  //     httpOptions
  //   );
  // }
  //updated by DIVYA On 16-10-2023 Monday
  getIvHistory(symbols, fromDate, toDate,expiry:any) {
    return this.http.post(
      API_URL + "/api/common/getivdatabydate",
      JSON.stringify({
        symbols: symbols,
        fromDate: fromDate,
        toDate: toDate,
        expiry:expiry
      }),
      httpOptions
    );
  }

  getProfile(id) {
    return this.http.post(
      API_URL + `/api/user/getuserdetails`,
      id,
      httpOptions
    );
  }

  getSymbols(_searchterm?: string) {
    let values = { searchTerm: _searchterm };
    return this.http.post(
      API_URL + `/api/common/getinternalsymbols`,
      JSON.stringify(values),
      httpOptions
    );
  }
  getSymbolsDetails(symbols: string[]) {
    return this.http.post(
      API_URL + `/api/common/GetInternalSymbolsDetails`,
      JSON.stringify(symbols),
      httpOptions
    );
  }
  getAllSymbols() {
    return this.http.get(API_URL + `/api/common/getsymbols`, httpOptions);
  }
  updateAllStockList() {
    if (this.AllStockList.length == 0) {
      this.getSymbols("#all#").subscribe(
        (_stocks: any[]) => {
          _stocks.forEach((x) => {
            x.alias = x.symbol;
            if (x.symbol.includes("CE")) {
              if (
                x.symbol.slice(x.symbol.length - 2, x.symbol.length) == "CE"
              ) {
                let index = x.symbol.indexOf("2");
                let symbol = x.symbol.slice(0, index);
                let strike = x.symbol.slice(index + 6, x.symbol.length - 2);
                let expiry = x.symbol.slice(index, index + 6);
                let month = monthNames[Number(expiry.substr(2, 2)) - 1];
                let year = Number(expiry.substr(0, 2));
                let date = Number(expiry.substr(4, 2));
                x.expiry = `${date} ${month}`;
                x.alias = `${symbol} ${month} ${strike} CE`;
                x.tradingSymbol = `${symbol}${year}${month}${strike}CE`;
              }
            } else if (x.symbol.includes("PE")) {
              if (
                x.symbol.slice(x.symbol.length - 2, x.symbol.length) == "PE"
              ) {
                let index = x.symbol.indexOf("2");
                let symbol = x.symbol.slice(0, index);
                let strike = x.symbol.slice(index + 6, x.symbol.length - 2);
                let expiry = x.symbol.slice(index, index + 6);
                let month = monthNames[Number(expiry.substr(2, 2)) - 1];
                let date = Number(expiry.substr(4, 2));
                let year = Number(expiry.substr(0, 2));
                x.expiry = `${date} ${month}`;
                x.alias = `${symbol} ${month} ${strike} PE`;
                x.tradingSymbol = `${symbol}${year}${month}${strike}PE`;
              }
            } else if (x.symbol.includes("-I")) {
              let arr = x.symbol.split("-");
              let currentMonth = getIST().getMonth();
              if (arr[1] == "I") {
                x.alias = `${arr[0]} FUT ${monthNames[currentMonth]}`;
                x.tradingSymbol = `${arr[0]}22${monthNames[currentMonth]}FUT`;
              }
              if (arr[1] == "II") {
                x.alias = `${arr[0]} FUT ${monthNames[currentMonth + 1]}`;
                x.tradingSymbol = `${arr[0]}22${monthNames[currentMonth]}FUT`;
              }
              if (arr[1] == "III") {
                x.alias = `${arr[0]} FUT ${monthNames[currentMonth + 2]}`;
                x.tradingSymbol = `${arr[0]}22${monthNames[currentMonth]}FUT`;
              }
            }
          });
          this.AllStockList = _stocks;
        },
        () => {},
        () => {}
      );
    }
  }
  getOptionSnapshot(symbol: string, time: any, expiry: any) {
    return this.http.post(
      API_URL + `/api/common/optionsnapshot`,
      JSON.stringify({ symbol: symbol, time: time, expiry: expiry }),
      httpOptions
    );
  }
 
  transformCurrency(value, decimals) {
    if (value) {
      value = Number(value);
      return Number(value?.toFixed(decimals)).toLocaleString("en-IN");
    }
    return value;
  }
  getFOIG(interval: number, type: string) {
    return this.http.post(
      API_URL + `/api/common/foig`,
      JSON.stringify({ interval: interval, type: type }),
      httpOptions
    );
  }

  #startCouponSection

  getAllCoupons() {
    
      return this.http.post(API_URL + "/api/Order/coupon-get",httpOptions);
    }
  saveCoupon(id, name, description, discountType,discountValue, active) {
    // debugger;
    return this.http.post(
      API_URL + "/api/Order/coupon",
      JSON.stringify({
        couponId: id,
        name: name,
        description: description,
        discountType: discountType,
        discountValue:discountValue,
        active: active,
      }),
      httpOptions
    );
  }
  deleteCoupon(id){
    return this.http.post(
      API_URL + `/api/Order/coupon-d/`,
      id,
      httpOptions
    );
  }

  #regioncouponsection
}
