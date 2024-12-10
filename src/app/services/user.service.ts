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
}
