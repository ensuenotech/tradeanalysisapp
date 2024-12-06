import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { httpOptions } from 'app/data/configData';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  ApiUrl = environment.coreAppURL + "/api/user/";

  constructor(private http: HttpClient) { }
  getAllNotifications() {
    return this.http.get(this.ApiUrl + "getallnotifications", httpOptions)
  }
  getReadNotifications(userId) {
    return this.http.get(this.ApiUrl + `getreadnotifications/${userId}`, httpOptions)
  }
  saveNotification(subject, notification) {
    var values = { subject: subject, notification: notification }
    return this.http.post(this.ApiUrl + 'savenotification', values, httpOptions);
  }
  readNotification(notificationId, userId, read: boolean) {
    var values = { notificationId: notificationId, userId: userId, read: read }
    return this.http.post(this.ApiUrl + 'readnotification', values, httpOptions);
  }
  deleteNotification(notificationId) {
    return this.http.post(this.ApiUrl + 'deletenotification', notificationId, httpOptions);
  }
}
export interface INotificationModel {
  id:number
  subject: string,
  notification: string,
  read?:boolean
}