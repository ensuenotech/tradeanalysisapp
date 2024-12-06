import { Injectable } from '@angular/core';
import { IRegisterUserModel } from 'app/model/register-user-model';
import { HttpClient } from '@angular/common/http';
import {
  httpOptions,
  FORGET_PASSWORD_SEND_OTP,
  FORGET_PASSWORD_VERIFY_OTP,
  FORGET_PASSWORD_CHANGE,
  API_URL
} from 'app/data/configData';

@Injectable({
  providedIn: 'root',
})
export class MaxPainService {
  constructor(private http: HttpClient) { }

  editMaxPain(maxpain: number, stockId: number) {
    var values = { maxpain: maxpain, stockId: stockId }
    return this.http.post(
      API_URL + '/api/common/updateMaxPain',
      values,
      httpOptions
    );
  }
}
