import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Services } from '../services.service';
import { httpOptions } from '../data/configData';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
private api_url:string =`${this.services.API_URL}`;
  constructor(private http: HttpClient, private services:Services) {}
  getSymbols(_searchterm?: string) {
    let values = { searchTerm: _searchterm };
    return this.http.post(
      this.api_url + `/api/common/getinternalsymbols`,
      JSON.stringify(values),
      httpOptions
    );
  }
  submitTrade(data:any){
      return this.http.post(this.api_url + `/api/user/saveTrade`, data, httpOptions);
    }
    submitPosition(data:any){
      return this.http.post(this.api_url + `/api/user/savePositions`, data, httpOptions);
    }
   
  
}
