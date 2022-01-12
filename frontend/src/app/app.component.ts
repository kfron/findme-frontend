import { Component, OnInit } from '@angular/core';
import { enableLocationRequest, isEnabled } from '@nativescript/geolocation';

@Component({
	selector: 'ns-app',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	async ngOnInit() {
		const enabled = await isEnabled();
		if (!enabled) {
			await enableLocationRequest(true, true);
		}
	}
}
