import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

export const API_URL = environment.coreAppURL;

export const REGISTER_URL = '/user/register';

export const LOGIN_URL = '/user/login';

export const GET_USER_URL = '/user';
export const GET_USER_DETAIL_URL = '/user/';
export const INSERT_USER_URL = '/user';
export const EDIT_USER_URL = '/user/';
export const VERIFY_OTP = '/user/verify-otp';

export const FORGET_PASSWORD_SEND_OTP = '/user/forgot-password/send-otp';
export const FORGET_PASSWORD_VERIFY_OTP = '/user/forgot-password/verify-otp';
export const FORGET_PASSWORD_CHANGE = '/user/forgot-password/change';
export const GET_PLANS='/admin/plans';
export const GET_SETTING='/admin/setting'

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
};
