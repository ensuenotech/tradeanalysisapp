import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { httpOptions } from '../data/configData';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  ApiUrl = environment.coreAppURL + "/api/user/";
  constructor(private http: HttpClient) { }

  login(email: string, password:any) {
    var values = { email: email, password: password };
    return this.http.post(
      this.ApiUrl + "validateuser",
      JSON.stringify(values),
      httpOptions
    );
  }
}
