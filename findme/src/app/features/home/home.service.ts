import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdResponse } from './ads.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private serverUrl = "http://10.0.2.2:3000/ads";

  constructor(private http: HttpClient) { }

  getAdsList(): Observable<AdResponse> {
    return (this.http.get(this.serverUrl+"/getAdsList") as Observable<AdResponse>);
  }

  getAdByid(id: number): Observable<AdResponse> {
    return (this.http.get(this.serverUrl+"/getAd?id="+id) as Observable<AdResponse>);
  }

}
