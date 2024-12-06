import { Injectable } from '@angular/core';
import { IRegisterUserModel } from 'app/model/register-user-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
	REGISTER_URL,
	httpOptions,
	LOGIN_URL,
	API_URL,
	
} from 'app/data/configData';
import { LocalStorageService } from './localStorage.service';

@Injectable({
	providedIn: 'root',
})
export class CalenderService {
	constructor(
		private http: HttpClient,
		private localStorageService: LocalStorageService
	) { }

	// getCalendars() {
	// 	return this.http.get(
	// 		BASE_URL + '/admin/calender?status=ACTIVE',
	// 		httpOptions
	// 	);
	// }
	// getCalendarDetails(id) {
	// 	return this.http.get(BASE_URL + '/admin/calender/' + id, httpOptions);
	// }

	// InsertCalendar(value) {
	// 	return this.http.post(
	// 		BASE_URL + '/admin/calender',
	// 		{ name: value },
	// 		httpOptions
	// 	);
	// }

	deleteCalendar(id) {
		return this.http.post(API_URL + `/api/common/deletecalendar`, id, httpOptions);

	}
	saveCalendar(id, name) {
		var values = { id: id, name: name }
		return this.http.post(API_URL + `/api/common/savecalendar`, values, httpOptions);

	}
	deleteCalendarDate(date) {
		return this.http.post(API_URL + `/api/common/deletecalendardate`, JSON.stringify(date), httpOptions);

	}
	// updateCalendar(id, date) {
	// 	return this.http.put(
	// 		BASE_URL + '/admin/calender/' + id,
	// 		{ date, isAdd: true },
	// 		httpOptions
	// 	);
	// }
	// deleteCalendar(id) {
	// 	return this.http.put(
	// 		BASE_URL + '/admin/calender/' + id,
	// 		{ status: 'INACTIVE' },
	// 		httpOptions
	// 	);
	// }
	// deleteDate(id, date) {
	// 	return this.http.put(
	// 		BASE_URL + '/admin/calender/' + id,
	// 		{ date, isAdd: false },
	// 		httpOptions
	// 	);
	// }
}
