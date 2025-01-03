import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './localStorage.service';
import { parseJwt } from '../utilities/jwtParser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './user.service';
import { ILoginModel } from '../model/auth.model';
import { Services } from '../services.service';
import { httpOptions } from '../data/configData';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user:any;
private API_URL:string =`${this.services.API_URL}/auth/`;
 private api_url:string = `${this.services.API_URL}/api/user/`
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private services: Services,
    private router: Router,
    private route:ActivatedRoute
  ) { 
  }

  // register(userData: IRegisterUserModel) {
  //   return this.http.post(API_URL +"/register", userData, httpOptions);
  // }

  // login(userData: ILoginModel, value: any) {
  //   return this.http.post(`${this.API_URL}/login`, userData);
  // }
  login(email: string, password:any) {
    var values = { email: email, password: password };
    return this.http.post(
      this.api_url + "validateuser",
      JSON.stringify(values),
      httpOptions
    );
  }
  refreshToken() {
    return this.http.get(`${this.api_url}refreshToken`);
  }

  logout() {
    this.localStorageService.delete('userToken');
    this.user = null;
    this.router.navigateByUrl('');
  }
  logoutAndGoToLoginPage() {
    this.localStorageService.delete('userToken');
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
