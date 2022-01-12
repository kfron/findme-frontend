import { Component, OnDestroy } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { MapView, Marker, MarkerEventData, Position, PositionEventData, Style } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { LocationService } from './../../../../shared/services/location.service';

@Component({
	moduleId: module.id,
	selector: 'fm-map-modal',
	templateUrl: './map-modal.component.html',
	styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnDestroy {
	private subscriptions: Subscription[] = []

	mapView: MapView
	currentLocation: Position
	isEnabled = false
	markerPosition: Position

	constructor(
		private params: ModalDialogParams,
		private locationService: LocationService
	) { }


	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	async onClose() {
		const pos = await this.locationService.getCurrentLocation();
		this.params.closeCallback(pos);
	}

	async onMapReady(event) {
		this.currentLocation = await this.locationService.getCurrentLocation();

		alert({
			title: 'Tip',
			okButtonText: 'Got it!',
			message: 'TAP to place a marker.\nDRAG to change it\'s position.'
		});

		this.mapView = event.object as MapView;
		this.mapView.latitude = this.currentLocation.latitude;
		this.mapView.longitude = this.currentLocation.longitude;
		this.mapView.zoom = 17;
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

	onCoordinateTap(event: PositionEventData) {
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

	onSubmitTap() {
		this.params.closeCallback(this.markerPosition);
	}

	onBackButtonTap() {
		this.params.closeCallback();
	}
}
