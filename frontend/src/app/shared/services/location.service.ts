import { Injectable } from '@angular/core';
import { CoreTypes } from '@nativescript/core';
import { getCurrentLocation, watchLocation } from '@nativescript/geolocation';
import { Position } from 'nativescript-google-maps-sdk';
import { Subject } from 'rxjs';

const options = {
	updateTime: 2000,
	desiredAccuracy: CoreTypes.Accuracy.high,
	maximumAge: 500,
	timeout: 2000
};

@Injectable({
	providedIn: 'root'
})
export class LocationService {

	position$: Subject<Position> = new Subject();
	constructor() {
		watchLocation(
			(loc) => {
				this.position$.next(Position.positionFromLatLng(loc.latitude, loc.longitude));
			},
			() => {
				this.position$.complete();
			},
			options
		);
	}

	async getCurrentLocation(): Promise<Position> {
		const loc = await getCurrentLocation(options);
		return Position.positionFromLatLng(loc.latitude, loc.longitude);
	}

}
