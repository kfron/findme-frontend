import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ad } from './ads.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private serverUrl = "http://10.0.2.2:3000/ads";

  constructor(private http: HttpClient) { }

  getAdsList(): Observable<Ad[]> {
    return (this.http.get(this.serverUrl+"/getAdsList") as Observable<Ad[]>);
  }

  getAdByid(id: number): Observable<Ad[]> {
    return (this.http.get(this.serverUrl+"/getAd?id="+id) as Observable<Ad[]>);
  }

}
