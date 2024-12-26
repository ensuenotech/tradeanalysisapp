import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { http } from "app/data/configData";
import { httpOptions } from "../data/configData";
import { environment } from "../environments/environment";
// import {
//   IRegisterUserModel,
//   IUserFormModel,
// } from "app/model/register-user-model";
import { parseJwt } from "../utilities/jwtParser";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import { Services } from "../services.service";

@Injectable({
  providedIn: "root",
})
export class UserService {
private API_URL:string =`${this.services.API_URL}/user`;
  constructor(private http: HttpClient, private services:Services) {}

  getloggedInUserDetails() {
    const userdata = localStorage.getItem("userData");
    const userdetails = parseJwt(userdata);
    return userdetails
  }

  refreshToken() {
    return this.http.get(`${this.API_URL}/refreshtoken`);
  }
  getTradeAnalysis() {
    return this.http.get(`${this.API_URL}/TradeAnalysis`)
  }
  getPositions() {
    return this.http.get(`${this.API_URL}/positions`)
  }
  sendWelcomeEmail(userId:any) {
    return this.http.post(this.API_URL + "welcome", userId, httpOptions);
  }
  searchUser(email: any) {
    return this.http.post(
      this.API_URL + "searchuser",
      JSON.stringify(email),
      httpOptions
    );
  }
  register(userData: any) {
    return this.http.post(this.API_URL + "register", userData, httpOptions);
  }
  registerviamobile(mobile: string) {
    return this.http.post(this.API_URL + "registerm", mobile, httpOptions);
  }
  sendOtp(userId:any, mobile:any) {
    return this.http.post(
      this.API_URL + "sendotp",
      JSON.stringify({ userId: userId, mobile: mobile }),
      httpOptions
    );
  }
  sendOtpMail(userId:any) {
    return this.http.post(this.API_URL + "sendotpmail", userId, httpOptions);
  }
  // sendWelcomeEmail(userId) {
  //   return this.http.post(this.ApiUrl + "welcome", userId, httpOptions);
  // }
  searchUserMobile(mobile: string) {
    return this.http.post(
      this.API_URL + "searchusermobile",
      JSON.stringify(mobile),
      httpOptions
    );
  }
  authenicateOTP(otp:any, userId:any) {
    return this.http.post(
      this.API_URL + "validateotp",
      { otp: otp, userId: userId },
      httpOptions
    );
  }
  sendOtpNew(userId: number, mobile: any,otpType:any) {
    return this.http.post(this.API_URL + 'sendotp', JSON.stringify({ userId: userId, mobile: mobile,otpType: otpType}), httpOptions);
  }
  registerviamobileNew(mobile: number, type:string) {
    return this.http.post(
      this.API_URL + 'registerm',
      JSON.stringify({ mobile: mobile, type: type}),
      httpOptions
    );
  }
}
