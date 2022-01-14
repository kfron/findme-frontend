import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { registerElement, RouterExtensions } from '@nativescript/angular';
import { CoreTypes } from '@nativescript/core';
import { getCurrentLocation, Location } from '@nativescript/geolocation';
import { MapView, Marker, MarkerEventData, Position, PositionEventData, Style } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { MapService } from '../../../../shared/services/map.service';

registerElement('MapView', () => MapView);

@Component({
	moduleId: module.id,
	selector: 'fm-map-ping',
	templateUrl: './map-ping.component.html',
	styleUrls: ['./map-ping.component.scss']
})
export class MapPingComponent implements OnDestroy {
	private subscriptions: Subscription[] = []

	mapView: MapView
	currentLocation: Location
	isEnabled = false
	markerPosition: Position

	constructor(
		private mapSerivce: MapService,
		private activatedRoute: ActivatedRoute,
		private routerExtensions: RouterExtensions
	) { }

	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	async onMapReady(event) {
		this.currentLocation = await getCurrentLocation({
			desiredAccuracy: CoreTypes.Accuracy.high,
			maximumAge: 5000,
			timeout: 20000
		});

		alert({
			title: 'Tip',
			okButtonText: 'Got it!',
			message: 'TAP to place a marker.\nDRAG to change it\'s position.'
		});

		this.mapView = event.object as MapView;
		this.mapView.latitude = this.currentLocation.latitude;
		this.mapView.longitude = this.currentLocation.longitude;
		this.mapView.zoom = 13;
		this.mapView.setStyle(<Style>JSON.parse(
			`[
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]`)
		);

		this.mapView.myLocationEnabled = true;

	}

	onMarkerSelect() {
		this.mapView.removeAllMarkers();
		this.markerPosition = null;
		this.isEnabled = false;
	}

	onCoordinateTapped(event: PositionEventData) {
		this.mapView.removeAllMarkers();

		const marker = new Marker();
		marker.position = event.position;
		marker.draggable = true;
		this.mapView.addMarker(marker);
		this.markerPosition = marker.position;
		this.isEnabled = true;
	}

	onMarkerDrag(event: MarkerEventData) {
		this.markerPosition = event.marker.position;
	}

	onSubmitTapped() {
		const adId = +this.activatedRoute.snapshot.params.adId;
		this.subscriptions.push(
			this.mapSerivce
				.createFinding(adId,
					this.markerPosition.latitude,
					this.markerPosition.longitude)
				.subscribe()
		);
		alert({
			title: 'Pong!',
			okButtonText: 'OK',
			message: 'Finding submitted.'
		});
		this.routerExtensions.back();
	}

}
