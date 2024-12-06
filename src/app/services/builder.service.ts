import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { httpOptions } from "app/data/configData";
import { IPaperTradeStrategySubComponentRequest } from "app/model/builder.model";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class BuilderService {
  ApiUrl = environment.coreAppURL + "/api/user/";
  // TestUrl = "https://testapi.i4option.com/api/common/";


  constructor(private http: HttpClient) { }

  getStrategies(id) {
    return this.http.post(
      this.ApiUrl + "GetBuilderStrategies/", JSON.stringify(id),
      httpOptions
    );
  }
  getStrategyComponents(id) {
    return this.http.get(
      this.ApiUrl + "GetBuilderStrategiesComponents/" + id,
      httpOptions
    );
  }
  getBuilderStrategySubComponents(id) {
    return this.http.get(
      this.ApiUrl + "GetBuilderStrategySubComponents/" + id,
      httpOptions
    );
  }

  saveStrategy(data) {
    return this.http.post(this.ApiUrl + "SaveStrategy", JSON.stringify(data), httpOptions);
  }
  saveStrategyComponent(data) {
    return this.http.post(
      this.ApiUrl + "SaveStrategyComponent",
      JSON.stringify(data),
      httpOptions
    );
  }
  saveStrategySubComponent(data: IPaperTradeStrategySubComponentRequest[]) {
    return this.http.post(
      this.ApiUrl + "SaveStrategySubComponent",
      JSON.stringify(data),
      httpOptions
    );
  }
  updateExitPrice(data) {
    return this.http.post(this.ApiUrl + "UpdateExitPrice", data, httpOptions);
  }
  deleteBuilderStrategy(id) {
    return this.http.post(
      this.ApiUrl + "DeleteBuilderStrategy",
      id,
      httpOptions
    );
  }
  deleteBuilderStrategiesComponent(id) {
    return this.http.post(
      this.ApiUrl + "DeleteBuilderStrategiesComponent",
      id,
      httpOptions
    );
  }
  deleteBuilderStrategySubComponent(id) {
    return this.http.post(
      this.ApiUrl + "DeleteBuilderStrategySubComponent",
      id,
      httpOptions
    );
  }
}
