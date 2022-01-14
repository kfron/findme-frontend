import { Component, OnInit } from '@angular/core';
import { enableLocationRequest, isEnabled } from '@nativescript/geolocation';
import { LocationService } from './shared/services/location.service';

@Component({
	selector: 'ns-app',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	constructor(
		private locationService: LocationService
	) {

	}
	async ngOnInit() {
		const enabled = await isEnabled();
		if (!enabled) {
			await enableLocationRequest(true, true);
		}
		this.locationService.position$.subscribe();
	}
}
