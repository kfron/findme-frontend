import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ad } from './ads.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private serverUrl = "https://mysterious-inlet-42373.herokuapp.com/";

  constructor(private http: HttpClient) { }

  getAdsList(): Observable<Ad[]> {
    return (this.http.get(this.serverUrl+"ads/getAdsList") as Observable<Ad[]>);
  }

  getAdByid(id: number): Observable<Ad[]> {
    return (this.http.get(this.serverUrl+"ads/getAd?id="+id) as Observable<Ad[]>);
  }

}
