import { Injectable } from '@angular/core';
import { CoreTypes } from '@nativescript/core';
import { watchLocation, getCurrentLocation, Location } from '@nativescript/geolocation';
import { Position } from 'nativescript-google-maps-sdk';
import { Observable, Subject } from 'rxjs';

const options = {
  updateTime: 2000,
  desiredAccuracy: CoreTypes.Accuracy.high,
  maximumAge: 500,
  timeout: 2000
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  position$: Subject<Position> = new Subject();
  constructor() {
    watchLocation(
      (loc) => {
        this.position$.next(Position.positionFromLatLng(loc.latitude, loc.longitude))
      },
      (err) => {
        this.position$.complete()
      },
      options
    )
  }

  async getCurrentLocation(): Promise<Position> {
    let loc = await getCurrentLocation(options)
    return Position.positionFromLatLng(loc.latitude, loc.longitude);
  }

}
