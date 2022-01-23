import { Component, OnInit } from '@angular/core';
import { LocationService } from './shared/services/location.service';

@Component({
	selector: 'ns-app',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	constructor(
		private locationService: LocationService
	) { }
	ngOnInit() {
		this.locationService.position$.subscribe();
	}
}
