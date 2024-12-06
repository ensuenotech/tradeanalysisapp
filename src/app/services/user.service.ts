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

@Injectable({
  providedIn: "root",
})
export class UserService {
  ApiUrl = environment.coreAppURL + "/api/user/";
  constructor(private http: HttpClient) {}

  getloggedInUserDetails() {
    const userdata = localStorage.getItem("userData");
    const userdetails = parseJwt(userdata);
    return userdetails
  }

  getUserDetails(userId: number) {
    return this.http.post(this.ApiUrl + "getuserdetails", userId, httpOptions);
  }
  getusernames() {
    return this.http.get(this.ApiUrl + "usernames");
  }
  getfollowerTrades(userId: number) {
    return this.http.post(
      this.ApiUrl + "followertrades",
      JSON.stringify(userId),
      httpOptions
    );
  }
  saveUserDetails(userData: any) {
    return this.http.post(this.ApiUrl + "saveUser", userData, httpOptions);
  }
  register(userData: any) {
    return this.http.post(this.ApiUrl + "register", userData, httpOptions);
  }
  registerviamobile(mobile: string) {
    return this.http.post(this.ApiUrl + "registerm", mobile, httpOptions);
  }
  authenicateOTP(otp:any, userId:any) {
    return this.http.post(
      this.ApiUrl + "validateotp",
      { otp: otp, userId: userId },
      httpOptions
    );
  }
  sendOtp(userId:any, mobile:any) {
    return this.http.post(
      this.ApiUrl + "sendotp",
      JSON.stringify({ userId: userId, mobile: mobile }),
      httpOptions
    );
  }
  sendOtpMail(userId:any) {
    return this.http.post(this.ApiUrl + "sendotpmail", userId, httpOptions);
  }
  sendWelcomeEmail(userId:any) {
    return this.http.post(this.ApiUrl + "welcome", userId, httpOptions);
  }

  deleteUser(userId: number) {
    return this.http.post(this.ApiUrl + "deleteuser", userId, httpOptions);
  }
  changePassword(values:any) {
    return this.http.post(
      this.ApiUrl + "changepassword",
      JSON.stringify(values),
      httpOptions
    );
  }
  refreshToken(token: string) {
    return this.http.post(
      this.ApiUrl + "refreshtoken",
      JSON.stringify(token),
      httpOptions
    );
  }
  searchUser(email: string) {
    return this.http.post(
      this.ApiUrl + "searchuser",
      JSON.stringify(email),
      httpOptions
    );
  }
  searchUserMobile(mobile: string) {
    return this.http.post(
      this.ApiUrl + "searchusermobile",
      JSON.stringify(mobile),
      httpOptions
    );
  }
  login(email: string, password:any) {
    var values = { email: email, password: password };
    return this.http.post(
      this.ApiUrl + "validateuser",
      JSON.stringify(values),
      httpOptions
    );
  }
  validateToken(token: string) {
    return this.http.post(
      this.ApiUrl + "validate",
      JSON.stringify(token),
      httpOptions
    );
  }
  downloadAll() {
    return this.http.post(this.ApiUrl + "downloadusers", httpOptions);
  }
  downloadPandLReports(UserId: number) {
    return this.http.post(
      this.ApiUrl + "downloadpandlreports",
      UserId,
      httpOptions
    );
  }
  downloadPandLReportsDW(UserId: number, date: Date) {
    return this.http.post(
      this.ApiUrl + "downloadpandlreportsdw",
      { userId: UserId, date: date },
      httpOptions
    );
  }
  gettoppers(sortBy: string, userId: number) {
    return this.http.post(
      this.ApiUrl + "toppers",
      JSON.stringify({ sortBy: sortBy, userId: userId }),
      httpOptions
    );
  }
  toppersearch(search_term: string) {
    return this.http.post(
      this.ApiUrl + "toppersearch",
      JSON.stringify(search_term),
      httpOptions
    );
  }

  //#region Alerts
  saveAlert(
    symbolType: string,
    symbol: string,
    alertFor: string,
    condition: string,
    value: Number,
    userId: number
  ) {
    var values = {
      symbolType: symbolType,
      symbol: symbol,
      alertFor: alertFor,
      condition: condition,
      value: value,
      userId: userId,
    };
    return this.http.post(
      this.ApiUrl + "saveAlert",
      JSON.stringify(values),
      httpOptions
    );
  }
  getAlert(userId: number) {
    return this.http.post(
      this.ApiUrl + "getAlerts",
      JSON.stringify(userId),
      httpOptions
    );
  }
  deleteAlert(alertId: number) {
    return this.http.post(
      this.ApiUrl + "deletealert",
      JSON.stringify(alertId),
      httpOptions
    );
  }
  //#endregion

  GetStates(id: number) {
    return this.http.get(this.ApiUrl + "getstates/" + id);
  }
  GetCountries() {
    return this.http.get(this.ApiUrl + "getcountries");
  }
  getWalletBalance(userId: number) {
    return this.http.post(
      this.ApiUrl + "getWalletBalance",
      JSON.stringify(userId),
      httpOptions
    );
  }
  addFundsToWallet(userId: number, amount: number) {
    return this.http.post(
      this.ApiUrl + "funds",
      JSON.stringify({ userId: userId, amount: amount }),
      httpOptions
    );
  }

  getMargin(values: IMarginCalculationRequest[]) {
    return this.http.post(
      this.ApiUrl + "getmargin",
      JSON.stringify(values),
      httpOptions
    );
  }

  //#region Payment Plans
  getPaymentPlans() {
    return this.http.post(this.ApiUrl + "getpaymentplans", httpOptions);
  }
  savePaymentPlan(id:any, name:any, amount:any, days:any,domain:any, remarks:any) {
    return this.http.post(
      this.ApiUrl + "savepaymentplan",
      JSON.stringify({
        id: id,
        name: name,
        amount: amount,
        days: days,
        domain:domain,
        remarks: remarks,
      }),
      httpOptions
    );
  }
  deletePaymentPlan(id:any) {
    return this.http.post(
      this.ApiUrl + "deletepaymentplan",
      JSON.stringify(id),
      httpOptions
    );
  }
  //#endregion


  getFollows(userId: number) {
    return this.http.post(
      this.ApiUrl + "getfollows",
      JSON.stringify(userId),
      httpOptions
    );
  }
  follow(userId: number, followerId: number) {
    return this.http.post(
      this.ApiUrl + "follow ",
      JSON.stringify({ userId: userId, followerId: followerId }),
      httpOptions
    );
  }
  unfollow(userId: number, followerId: number) {
    return this.http.post(
      this.ApiUrl + "unfollow ",
      JSON.stringify({ userId: userId, followerId: followerId }),
      httpOptions
    );
  }
  getTradeAnalysis(userId: number) {
    return this.http.post(
      this.ApiUrl + "tradeanalysis",
      JSON.stringify(userId),
      httpOptions
    );
  }

  //#endregion
}
export interface IMarginCalculationRequest {
  symbol: string;
  quantity: number;
  price: number;
  triggerPrice: number;
  transactionType: transactionType;
  userId:number;
  // lotSize: number;
  // strategy: string;
}
export enum transactionType {
  BUY = "BUY",
  SELL = "SELL",
}
