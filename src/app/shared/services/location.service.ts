import { Injectable } from '@angular/core';
import { CoreTypes } from '@nativescript/core';
import { enableLocationRequest, isEnabled, Location, watchLocation } from '@nativescript/geolocation';
import { Position } from 'nativescript-google-maps-sdk';
import { Subject } from 'rxjs';

const options = {
	updateTime: 1000,
	desiredAccuracy: CoreTypes.Accuracy.high,
	updateDistance: 2
};

@Injectable({
	providedIn: 'root'
})
export class LocationService {

	private _location: Location;

	position$: Subject<Position> = new Subject();

	/**
	 * Weryfikuje, czy aplikacja ma dostęp do danych nawigacyjnych.
	 * Jeśli nie, to prosi o ich włączenie.
	 * W przypadku zaakceptowania rozpoczyna nasłuchiwanie zmian pozycji urządzenia i 
	 * odpowiednio ją emituje do użytku innych komponentów.
	 */
	constructor() {
		isEnabled()
			.then(
				(value) => {
					if (value) {
						watchLocation(
							(loc) => {
								this._location = loc;
								this.position$.next(Position.positionFromLatLng(loc.latitude, loc.longitude));
							},
							() => {
								this.position$.complete();
							},
							options
						);
					} else {
						enableLocationRequest(false)
							.then(
								() => {
									watchLocation(
										(loc) => {
											this._location = loc;
											this.position$.next(Position.positionFromLatLng(loc.latitude, loc.longitude));
										},
										() => {
											this.position$.complete();
										},
										options
									);
								});
					}
				}
			);
	}

	/**
	 * Pobiera obecną lokację urządzenia i mapuje ją do typu Position.
	 * 
	 * @returns obecną pozycję urządzenia
	 */
	async getCurrentLocation(): Promise<Position> {
		return Position.positionFromLatLng(this._location.latitude, this._location.longitude);
	}

}
