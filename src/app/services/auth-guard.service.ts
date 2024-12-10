import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import moment from 'moment';
import { AuthService } from './auth.service';
import { getIST } from '../utilities/utils';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot) {
        let currentUser = this.authService.getUserId();
        if (currentUser) {
            let tokenDetails = this.authService.getTokenDetails()
            // console.log("tdetails",tokenDetails)
            if (tokenDetails.LIVE_PLAN_EXPIRE_DATE < moment(getIST()).unix()) {
                this.authService.logoutAndGoToLoginPage()

            }
            // let encryptedMessage = localStorage.getItem('userStatus');
            // let decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, 'bmsInfo').toString(CryptoJS.enc.Utf8);
            let role;
            if (new Date(tokenDetails.LIVE_PLAN_EXPIRE_DATE) < new Date(getIST())) {
                role = 'unsubscribed'
            }
            else{
                role = "subscribed"

            }
             
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.authService.logoutAndGoToLoginPage()
        return false;
    }

}