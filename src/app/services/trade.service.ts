import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { httpOptions } from "../data/configData";
// import { IDhanOrderRequest } from "app/model/stocks.model";
import { EncService } from "./enc.service";
import { API_URL } from "../data/configData";
// import { post } from "jquery";
export interface ISymbolDetails {
  alias: string;
  expiry: Date;
  lotSize: number;
  symbol: string;
  symbolId: number;
  strike: number;
  tradingSymbol: string;
}
@Injectable({
  providedIn: "root",
})
export class TradeService {
  allStockList:ISymbolDetails[]=[]
  constructor(private http: HttpClient,private encService:EncService) {
    let stocksList = localStorage.getItem('allStockList');
    if (stocksList != null) {
      this.allStockList = JSON.parse(this.encService.decrypt(stocksList));
    }

   
  }
  

  watchListSave(data: any) {
    return this.http.post(API_URL + `/api/user/saveWatchList`, data);
  }

  watchListGet(data: any) {
    return this.http.post(API_URL + `/api/user/getWatchlists`, data);
  }

  deleteWatchList(id: any) {
    return this.http.post(API_URL + `/api/user/removeWatchList`, id);
  }

  buyOrSell(data: any) {
    return this.http.post(API_URL + `/api/user/saveTrade`, data);
  }
  saveBasketOrder(data: any) {
    return this.http.post(API_URL + `/api/user/savebasket`, data);
  }

  orderListData(id: any) {
    return this.http.post(API_URL + `/api/user/getTrades`, id);
  }

  allTrades(id: any) {
    return this.http.post(API_URL + `/api/user/getAllTrades`, id);
  }

  getPositionListVal(id: any) {
    return this.http.post(API_URL + `/api/user/getPositions`, id);
  }

  savePositionData(data: any) {
    return this.http.post(API_URL + `/api/user/savePositions`, data);
  }

  removeTrade(id: any) {
    return this.http.post(API_URL + `/api/user/removeTrade`, id);
  }
  removeBasketOrder(id: any) {
    return this.http.post(API_URL + `/api/user/removebasketorder`, id);
  }

  getbaskets(userid: any) {
    return this.http.post(API_URL + `/api/user/basket/${userid}`, httpOptions);
  }
  createBasket(name: any, userId: any) {
    return this.http.post(
      API_URL + `/api/user/basket`,
      JSON.stringify({ name: name, userid: userId }),
      httpOptions
    );
  }
  deleteBasket(basketId: any) {
    return this.http.post(
      API_URL + `/api/user/basketdelete/`,
      JSON.stringify(basketId),
      httpOptions
    );
  }
  placeDhanOrder(request: any) {
    return this.http.post(
      `${API_URL}/api/user/dhanorder`,
      JSON.stringify(request),
      httpOptions
    );
  }
  getDhanOrders(userId: number) {
    return this.http.post(
      `${API_URL}/api/user/dhanorders`,
      JSON.stringify(userId),
      httpOptions
    );
  }
  getDhanPositions(userId: number) {
    return this.http.post(
      `${API_URL}/api/user/dhanpositions`,
      JSON.stringify(userId),
      httpOptions
    );
  }
}
