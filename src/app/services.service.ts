import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { LocalStorageService } from "./services/localStorage.service";
// import { io, Socket } from "socket.io-client";
import { environment } from "./environments/environment";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
// import * as CryptoJS from "crypto-js";
import { configurationService } from "./services/configurationService";
import { EncService } from "./services/enc.service";
import { getIST } from "./utilities/utils";
import moment from "moment";
// import { IUserDetailsModel } from "./model/register-user-model";
import { UserService } from "./services/user.service";

@Injectable({
  providedIn: "root",
})
export class Services {
  headers = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  API_URL = environment.coreAppURL || "";
  userData!: any;
  constructor(
  ) {
     
  }
  
}
