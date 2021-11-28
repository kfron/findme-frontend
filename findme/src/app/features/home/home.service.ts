import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

const pets = [{
    ID: 1234,
    name: "Kevin",
    age: 12,
    pic: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/2560x3839/australian-shepherd.jpg?resize=980:*",
    localizations: [
      {x: 123, y: 234},
      {x: 122, y: 442},
      {x: 24, y: 122}
    ]
  },
  {
    ID: 1232,
    name: "Max",
    age: 4,
    pic: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/16/08/gettyimages-464163411.jpg?crop=1.0xw:1xh;center,top&resize=980:*",
    localizations: [
      {x: -123, y: 12}
    ]
  },
  {
    ID: 3233,
    name: "Mufinka",
    age: 1,
    pic: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/pembroke-welsh-corgi.jpg?crop=1xw:0.9997114829774957xh;center,top&resize=980:*",
    localizations: [
      {x: 421, y: -114},
      {x: 522, y: 612}
    ]
  }]

@Injectable({
  providedIn: 'root'
})
export class HomeService {


  constructor(private http: HttpClient) { }

  getAdsList(): Observable<any> {
    return of(pets.map((pet) => ({ID: pet.ID, name: pet.name, age: pet.age, pic: pet.pic})))
  }

  getAdByID(id: number) {
    return pets.filter((pet) => pet.ID === id)[0]
  }
}
