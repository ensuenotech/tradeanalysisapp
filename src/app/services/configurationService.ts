import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { httpOptions ,API_URL} from '../data/configData';


@Injectable({
  providedIn: 'root'
})
export class configurationService {
  constructor(
    private http: HttpClient,

  ) { }
  getMarketHolidayData() {
    return this.http.get(API_URL + `/api/common/getmarketholiday`);
  }
  getHolidays() {
    return this.http.get(API_URL + `/api/common/getholidays`);
  }

  updateMarketHoliday(isOpen: boolean, days: number) {
    return this.http.post(
      API_URL + `/api/common/updatemarketholiday`, { isOpen: isOpen, days: days }, httpOptions);
  }

}
