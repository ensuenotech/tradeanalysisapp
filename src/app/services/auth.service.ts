import { Injectable } from '@angular/core';
// import { IRegisterUserModel } from 'app/model/register-user-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {
//   API_URL,
//   REGISTER_URL,
//   httpOptions,
//   LOGIN_URL,
//   VERIFY_OTP,
// } from 'app/data/configData';
import { httpOptions,API_URL } from '../data/configData';
import { LocalStorageService } from './localStorage.service';
// import { Role } from 'app/model/roles-model';
import { parseJwt } from '../utilities/jwtParser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user:any;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private router: Router,
    private route:ActivatedRoute
  ) { 
  }

  // register(userData: IRegisterUserModel) {
  //   return this.http.post(API_URL +"/register", userData, httpOptions);
  // }

  // login(userData) {
  //   return this.http.post(this.core + LOGIN_URL, userData, httpOptions);
  // }

  logout() {
    this.localStorageService.delete('userToken');
    this.localStorageService.delete('userStatus');
    this.user = null;
    this.router.navigateByUrl('');
  }
  logoutAndGoToLoginPage() {
    this.localStorageService.delete('userToken');
    this.localStorageService.delete('userStatus');
    this.user = null;
    this.router.navigateByUrl('/login');
  }

  setUserType(type: any) {
    this.user = type;
  }

  getUserId() {
    const token = this.localStorageService.get('userToken');
    if(token==null) return null;
    return parseJwt(token).nameid;
  }
  getTokenDetails() {
    const token = this.localStorageService.get('userToken');
    if(token==null) return null;
    return parseJwt(token);
  }
  getToken() {
    const token = this.localStorageService.get('userToken');
    if(token==null) return null;
    return token;
  }

  // isAuthenticated() {
  // if (!!this.user) {
  //   return true;
  // } else {
  // const token = this.localStorageService.get('userToken');

  // this.userService.refreshToken(token).subscribe((res: any) => {
  //   if (res.success) {
  //     const parsedToken = parseJwt(token);
  //     this.user = parsedToken.sub;
  //     // return !!this.user;
  //     return this.user
  //   }
  //   else {
  //     return null
  //     // this.router.navigate(['login']);

  //   }
  // })

  // }
  // }

  isAdminUser() {
    const token = this.localStorageService.get('userToken');
    const parsedToken = parseJwt(token);
    let user = parsedToken.sub;
    if (user == "ADMIN") {
      return true
    }
    // return this.user === Role.admin;
    return false
  }
 
}
