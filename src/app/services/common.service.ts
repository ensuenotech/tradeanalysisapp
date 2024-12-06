import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  ApiUrl = environment.coreAppURL +'/api/common/'
  constructor(private http: HttpClient) {}

  
}
