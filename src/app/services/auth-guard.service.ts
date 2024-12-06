import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { getIST } from 'app/utilities/utils';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { AuthService } from './auth.service';
import { parseJwt } from "app/utilities/jwtParser";

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
             if (route.data.roles && route.data.roles.indexOf(role) === -1) {
                if (new Date(tokenDetails.LIVE_PLAN_EXPIRE_DATE) < new Date(getIST())) {
                    this.showAlert()
                }
                return false;
            }
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.authService.logoutAndGoToLoginPage()
        return false;
    }

    showAlert() {
        this.router.navigateByUrl("/subscription/subscribeplan")
    }
}