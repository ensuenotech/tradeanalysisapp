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
  private marketHoliday:any;
  headers = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  wsBaseURL = environment.wsURL;
  wsTradeURL = environment.wsTradeURL;
  socket: any;
  tradeSocket: any;
  historySocket: any;
  encryptSecretKey = "14option1234";
  holidays: Date[] = [];
  userData!: any;
  constructor(
    private localStorage: LocalStorageService,
    private authService: AuthService,
    private configService: configurationService,
    private encService: EncService,
    private router: Router
  ) {
    var usertoken = this.authService.getTokenDetails();

    if (usertoken == null) {
      this.router.navigateByUrl("/subscription/subscribeplan");
      return;
    } else {
      const _userdata = localStorage.get("userdata");
      if (_userdata) {
        // this.userData = JSON.parse(this.encService.decrypt(_userdata));
      }
    }
    // if (moment(usertoken.exp * 1000).date() != moment().date()) return
    try {
      let _holidays = this.localStorage.get("holidays");

      if (_holidays != null) {
        this.holidays = JSON.parse(this.encService.decrypt(_holidays)).map(
          (x:any) => {
            return new Date(x);
          }
        );
      } else {
        this.configService.getHolidays().subscribe((res: any) => {
          this.holidays = res;
          this.localStorage.set(
            "holidays",
            this.encService.encrypt(JSON.stringify(res))
          );
        });
      }
    } catch (err) {
      this.localStorage.delete("holidays");
    }
    let userid = this.authService.getUserId();
    if (this.marketHoliday == undefined && userid)
      this.configService.getMarketHolidayData().subscribe(
        (res) => {
          this.setMarketHoliday(res);
        },
        (err) => {
          if (err.status == 401) {
            this.localStorage.delete("userData");
            this.localStorage.delete("userToken");
            this.localStorage.delete("userStatus");
          }
        }
      );
  }
  setMarketHoliday(days:any) {
    this.marketHoliday = days;
  }
  getMarketHoliday() {
    // let holidays: Date[] = JSON.parse(
    //   this.encService.decrypt(this.localStorage.get("holidays"))
    // ).map((x) => {
    //   return new Date(x);
    // });
    // if (holidays.find((h) => h.getDate() == getIST().getDate()) != undefined)
    //   return -1;
    // return 0;
  }
  

  // GetAllAttributes() {
  //     let socket = new WebSocket("wss://push.truedata.in:8082?user=<uname>&password=<pwd>");
  //     var url = "wss://push.truedata.in:8082?user=<uname>&password=<pwd>";
  //     return this.http.get(url);
  // }

  GetSocketURL() {
    return this.wsBaseURL;
  }

  GetSocketConn() {
    // const usertoken = this.authService.getTokenDetails();
    // if (moment(usertoken.exp*1000).toDate() < moment(getIST()).toDate() && usertoken.sub!='ADMIN') {
    //   if (this.socket !== undefined) {
    //     this.socket?.disconnect();
    //   }
    //   return;
    // }
    if ((this.localStorage.get("userToken") || "") === "") {
      if (this.socket !== undefined) {
        this.socket?.disconnect();
      }
      return;
    }
    if (this.socket === undefined) {
      // this.socket = io(this.GetSocketURL(), { transports: ["websocket"] });
      this.socket?.on("disconnect", () => {
        this.socket = undefined;
      });
    }
    this.socket?.removeListener("message");
    this.socket?.removeListener("reconnect");
    this.socket?.removeListener("connect");
    this.socket?.on("error", (error: any) => {
      let e = JSON.parse(error);
      this.socketErrorHandler(e);
    });
    this.socket?.on("err", (error: any) => {
      this.socketErrorHandler(error);
    });
    return this.socket;
  }
  GetTradeSocketConn() {
    if ((this.localStorage.get("userToken") || "") === "") {
      if (this.tradeSocket !== undefined) {
        this.tradeSocket.disconnect();
      }
      return;
    }
    if (this.tradeSocket === undefined) {
      // this.tradeSocket = io(
      //   this.wsTradeURL + "?token=" + this.localStorage.get("userToken"),
      //   { transports: ["websocket"] }
      // );
      this.tradeSocket.on("disconnect", () => {
        this.tradeSocket = undefined;
      });
    }
    this.tradeSocket.removeListener("message");
    this.tradeSocket.removeListener("reconnect");
    this.tradeSocket.removeListener("connect");
    this.tradeSocket.on("error", (error: any) => {
      let e = JSON.parse(error);
      this.socketErrorHandler(e);
    });
    this.tradeSocket.on("err", (error: any) => {
      this.socketErrorHandler(error);
    });
    return this.tradeSocket;
  }

  DisconnectSocket() {
    if (this.socket === undefined) {
      return;
    }
    this.socket?.disconnect();
    this.socket = undefined;
  }
  socketErrorHandler(error: any) {
    console.log(error);
    const code = error.errorCode;
    switch (code) {
      case "NOT_AUTHENTICATED":
        this.authService.logout();
        this.DisconnectSocket();
        break;
      case "PLAN_EXPIRED":
        this.router.navigateByUrl("/contact-admin");
        break;
      case "MAX_SYMBOL_LIMIT_REACHED":
        alert(
          `You have reached maximum symbols subscribed limit of ${error.count}\nPlease close additional tabs and retry in few seconds.`
        );
        break;
      case "MAX_CONNECTION_LIMIT_REACHED":
        alert(
          `You have reached maximum parallel connection limit of ${error.count}\nPlease close additional tabs and retry in few seconds.`
        );
        break;
    }
  }

  formatDate(_date:any) {
    var date = new Date(_date);
    var year = date.getFullYear();
    var mn = date.getMonth() + 1;
    var dt = date.getDate();
    var dtt;
    var month;
    if (dt < 10) {
      dtt = "0" + dt;
    } else {
      dtt = dt;
    }
    if (mn < 10) {
      month = "0" + mn;
    } else {
      month = mn;
    }
    return year + "-" + month + "-" + dtt;
  }
  formatTime(_date:any) {
    var date = new Date(_date);
    var year = date.getFullYear();
    var mn = date.getMonth() + 1;
    var dt = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var dtt;
    var month;
    var hour;
    var minute;
    if (dt < 10) {
      dtt = "0" + dt;
    } else {
      dtt = dt;
    }
    if (mn < 10) {
      month = "0" + mn;
    } else {
      month = mn;
    }
    if (hh < 10) {
      hour = "0" + hh;
    } else {
      hour = hh;
    }
    if (mm < 10) {
      minute = "0" + mm;
    } else {
      minute = mm;
    }
    return year + ":" + month + ":" + dtt + " " + hour + ":" + month;
  }
  encryptData(data:any) {
    try {
      // return CryptoJS.AES.encrypt(
      //   JSON.stringify(data),
      //   this.encryptSecretKey
      // ).toString();
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  decryptData(data:any) {
    try {
      // const bytes = Crypto.AES.decrypt(data, this.encryptSecretKey);
      // if (bytes.toString()) {
      //   return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
  getToFrom = () => {
    let from: Date = new Date();
    let to: Date = new Date();
    let currentTime = getIST();

    // if (currentTime.getDay() == 1 && currentTime.getHours() < 9 || (currentTime.getHours() == 9 && currentTime.getMinutes() < 15)) {
    if (currentTime.getDay() == 1 && currentTime.getHours() < 9) {
      let _from = currentTime;
      from.setDate(_from.getDate() - 3);
      to.setDate(_from.getDate() - 3);
      to.setHours(15);
      to.setMinutes(30);
    } else if (currentTime.getDay() == 6) {
      let _from = currentTime;
      from.setDate(_from.getDate() - 1);
      to.setDate(_from.getDate() - 1);
      to.setHours(15);
      to.setMinutes(30);
    } else if (currentTime.getDay() == 0) {
      let _from = currentTime;
      from.setDate(_from.getDate() - 2);
      to.setDate(_from.getDate() - 2);
      to.setHours(15);
      to.setMinutes(30);
    } else {
      if (
        getIST().getHours() < 9 ||
        (getIST().getHours() == 9 && getIST().getMinutes() < 15)
      ) {
        from.setDate(getIST().getDate() - 1);
        to.setDate(getIST().getDate() - 1);
        to.setHours(15);
        to.setMinutes(30);
      } else {
        from = getIST();
        to = getIST();
      }
    }
    from = this.validateAndGetLastWorkingDay(from);
    to = this.validateAndGetLastWorkingDay(to);

    from.setHours(9);
    from.setMinutes(16);
    to.setHours(15);
    to.setMinutes(30);
    return { from: from, to: to };
  };
  test = [];
  // validateAndGetLastWorkingDay = (date: Date) => {
  // 	// let holidays: Date[] = JSON.parse(this.encService.decrypt(this.localStorage.get("holidays"))).map((x) => { return new Date(x) })
  // 	if (this.holidays.find(h => moment(h).format("DD-MM-YYYY") == moment(date).format("DD-MM-YYYY")) != undefined) {
  // 		date = moment(date).add(-1, "days").toDate()
  // 		this.validateAndGetLastWorkingDay(date)
  // 	}
  // 	this.test.push(date)
  // 	this.test.sort((a, b) => a - b)
  // 	return new Date(this.test[0])

  // }

  validateAndGetLastWorkingDay = (date: Date) => {
    if (date.getDay() == 1 && date.getHours() < 9) {
      date = moment(date).add(-3, "days").toDate();
    } else if (date.getDay() == 6) {
      date = moment(date).add(-1, "days").toDate();
    } else if (date.getDay() == 0) {
      date = moment(date).add(-2, "days").toDate();
    }

    if (
      this.holidays.find(
        (h) =>
          moment(h).format("DD-MM-YYYY") == moment(date).format("DD-MM-YYYY")
      ) != undefined
    ) {
      date = moment(date).add(-1, "days").toDate();
      this.validateAndGetLastWorkingDay(date);
    }
    return date;
  };
  validateAndGetNextWorkingDay = (date: Date) => {
    if (date.getDay() == 6) {
      date = moment(date).add(2, "days").toDate();
    } else if (date.getDay() == 0) {
      date = moment(date).add(1, "days").toDate();
    }

    if (
      this.holidays.find(
        (h) =>
          moment(h).format("DD-MM-YYYY") == moment(date).format("DD-MM-YYYY")
      ) != undefined
    ) {
      date = moment(date).add(1, "days").toDate();
      this.validateAndGetNextWorkingDay(date);
    }
    return date;
  };
}
