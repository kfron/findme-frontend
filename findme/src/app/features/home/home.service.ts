import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getAdsList(): Observable<any> {
    return of([
      {
        name: "Kevin",
        age: 12,
        ID: 1234,
        pic: "https://via.placeholder.com/300.png"
      },
      {
        name: "Max",
        age: 4,
        ID: 1232,
        pic: "https://via.placeholder.com/300.png"
      },
      {
        name: "Mufinka",
        age: 1,
        ID: 3233,
        pic: "https://via.placeholder.com/300.png"
      }
    ])
  }
}
