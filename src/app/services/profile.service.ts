import { Injectable } from '@angular/core';
import { IRegisterUserModel } from 'app/model/register-user-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL,  httpOptions } from 'app/data/configData';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) { }

  getProfile(id) {
    return this.http.post(API_URL + `/api/user/getuserdetails`, id, httpOptions);
  }

  changePassword(userId, password) {
    var values = {userId:userId, password:password}
    return this.http.post(API_URL + '/api/user/changePassword', values, httpOptions);
  }
}
