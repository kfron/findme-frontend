import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { Circle, MapView, Marker, MarkerEventData, Polyline, Position, PositionEventData, Style } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { LocationService } from './../../../../shared/services/location.service';
import { MapService } from './../../../../shared/services/map.service';

@Component({
	moduleId: module.id,
	selector: 'fm-map-modal',
	templateUrl: './map-modal.component.html',
	styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = []

	mapView: MapView
	currentLocation: Position
	isEnabled = false
	markerPosition: Position

	pinpointMode = true;
	adId: number;
	adPosition: Position;

	constructor(
		private params: ModalDialogParams,
		private locationService: LocationService,
		private mapService: MapService
	) {
	}

	ngOnInit(): void {
		if (this.params.context.pinpointMode !== undefined) {
			this.pinpointMode = false;
			this.adId = this.params.context.adId;
			this.adPosition = this.params.context.adPosition;
		}
	}

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

		if (this.pinpointMode) {
			alert({
				title: 'Tip',
				okButtonText: 'Got it!',
				message: 'TAP to place a marker.\nDRAG to change it\'s position.'
			});
		}

		this.mapView = event.object as MapView;
		this.mapView.latitude = this.adPosition.latitude;
		this.mapView.longitude = this.adPosition.longitude;
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

		if (!this.pinpointMode) {
			this.subscriptions.push(
				this.mapService.getNewestFinding(this.adId)
					.subscribe(
						(val) => this.drawRoute(val[0].id)
					)
			);
		}

	}

	drawRoute(startId) {
		this.subscriptions.push(
			this.mapService.getPath(startId)
				.subscribe((findings: any[]) => {
					findings.map(val => {
						val.position = Position.positionFromLatLng(val.lat, val.lon);
					});
					this.mapView.removeAllShapes();
					const path = [];
					findings.forEach(find => {
						path.push(find.position);
					});

					const polyline = new Polyline();
					path.forEach(pos => {
						polyline.addPoint(pos);
						const circle = new Circle();
						circle.center = pos;
						circle.radius = 500;
						circle.visible = true;
						circle.fillColor = this.mapService.circleFillColor;
						circle.strokeColor = this.mapService.circleStrokeColor;
						circle.strokeWidth = 2;
						this.mapView.addCircle(circle);
					});
					polyline.visible = true;
					polyline.width = 4;
					polyline.color = this.mapService.pathColor;
					polyline.geodesic = false;
					this.mapView.addPolyline(polyline);

					return path;
				}));
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
