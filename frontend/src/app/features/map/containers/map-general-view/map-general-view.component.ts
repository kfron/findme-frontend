import { Component, OnDestroy, OnInit } from '@angular/core';
import { registerElement, RouterExtensions } from '@nativescript/angular';
import { Color, NavigatedData, Page } from '@nativescript/core';
import { Circle, MapView, Marker, MarkerEventData, Polyline, Position, Style } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { MapService } from '../../../../shared/services/map.service';
import { LocationService } from './../../../../shared/services/location.service';
import { Finding } from '../../../../shared/models/map.model';

registerElement('MapView', () => MapView);

const zoomOptions: number[] = [15, 14, 11.7];

@Component({
	moduleId: module.id,
	selector: 'fm-map-general-view',
	templateUrl: './map-general-view.component.html',
	styleUrls: ['./map-general-view.component.scss']
})
export class MapGeneralViewComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = []

	closestFindings: Array<Finding> = []
	mapView: MapView
	currentPosition: Position
	toggleRadiusText = `Toggle radius (${this.mapService.searchRadius} km)`

	constructor(
		private mapService: MapService,
		private routerExtensions: RouterExtensions,
		private locationService: LocationService,
		private page: Page) {
		this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
	}

	ngOnInit(): void {
		this.subscriptions.push(
			this.locationService.position$.subscribe(
				(val) => { this.currentPosition = val; }
			)
		);
	}

	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	async onMapReady(event) {
		this.currentPosition = await this.locationService.getCurrentLocation();

		this.mapView = event.object as MapView;
		this.mapView.latitude = this.currentPosition.latitude;
		this.mapView.longitude = this.currentPosition.longitude;
		this.mapView.zoom = zoomOptions[this.mapService.searchRadiusIndex];
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
      ]`));

		this.subscriptions.push(this.mapService
			.getClosestTo(this.currentPosition.latitude, this.currentPosition.longitude, this.mapService.searchRadius)
			.subscribe((findings: any[]) => {
				findings.map(val => {
					val.found_at = new Date(val.found_at);
					val.position = Position.positionFromLatLng(val.lat, val.lon);
				});
				this.closestFindings = findings;
				this.setupAdMarkers();
			})
		);

		this.setupSearchCircle();

		this.mapView.myLocationEnabled = true;
	}

	onMarkerSelect(event: MarkerEventData) {
		if (event.marker.userData?.id) {
			event.marker.snippet = this.formatTimeSnippet(event.marker.userData.found_at);
			this.drawLine(event.marker.userData.id);
		}
	}

	setupAdMarkers() {
		for (let i = 0; i < this.closestFindings.length; i++) {
			const marker = new Marker();
			const find = this.closestFindings[i];
			marker.position = find.position;
			marker.userData =
			{
				id: find.id,
				ad_id: find.ad_id,
				found_at: find.found_at,
				prev_id: find.prev_id,
				next_id: find.next_id
			};
			marker.title = `${find.name}, ${find.age}`;
			marker.snippet = this.formatTimeSnippet(find.found_at);
			this.mapView.addMarker(marker);
		}
	}

	setupSearchCircle() {
		const circle = new Circle();
		circle.center = this.currentPosition;
		circle.radius = this.mapService.searchRadius * 1000;
		circle.visible = true;
		circle.fillColor = new Color(15, 85, 209, 250);
		circle.strokeColor = new Color('#559cfa');
		circle.strokeWidth = 2;
		this.mapView.addCircle(circle);
	}

	formatTimeSnippet(foundAt: Date) {
		const now = new Date();
		const diff = Math.abs(now.valueOf() - foundAt.valueOf());
		const weeks = Math.floor(diff / 604800000);
		const days = Math.floor((diff - weeks * 604800000) / 86400000);
		const hours = Math.floor((diff - weeks * 604800000 - days * 86400000) / 3600000);
		const minutes = Math.floor((diff - weeks * 604800000 - days * 86400000 - hours * 3600000) / 60000);
		let result = '';
		result += weeks === 1 ? ' week ' : weeks > 1 ? ' weeks ' : '';
		result += days === 1 ? days + ' day ' : days > 1 ? days + ' days ' : '';
		if (weeks > 0) return result + 'ago';
		result += hours === 1 ? hours + ' hour ' : hours > 1 ? hours + ' hours ' : '';
		if (days > 0) return result + 'ago';
		result += minutes === 1 ? minutes + ' minute ' : minutes > 1 ? minutes + ' minutes ' : '';
		return result + 'ago';
	}

	drawLine(startId: number) {
		this.subscriptions.push(this.mapService
			.getPath(startId)
			.subscribe((findings: any[]) => {
				findings.map(val => {
					val.position = Position.positionFromLatLng(val.lat, val.lon);
				});
				this.mapView.removeAllShapes();
				this.setupSearchCircle();
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

	onInfoWindowTap(event: MarkerEventData) {
		if (event.marker.userData?.id) {
			this.routerExtensions.navigate(['/home/ad-details', event.marker.userData.ad_id], {
				animated: true,
				transition: {
					name: 'slide',
					duration: 200,
					curve: 'ease',
				}
			});
		}
	}

	onNavigatedTo(data: NavigatedData) {
		if (data.isBackNavigation) {
			this.mapView.removeAllMarkers();
			this.mapView.removeAllShapes();
			this.setupSearchCircle();
			this.subscriptions.push(this.mapService
				.getClosestTo(this.currentPosition.latitude, this.currentPosition.longitude, this.mapService.searchRadius)
				.subscribe((findings: any[]) => {
					findings.map(val => {
						val.found_at = new Date(val.found_at);
						val.position = Position.positionFromLatLng(val.lat, val.lon);
					});
					this.closestFindings = findings;
					this.setupAdMarkers();
				}));
		}
	}

	onToggleRadiusTap() {
		this.mapService.toggleSearchRadius();
		this.toggleRadiusText = `Toggle radius (${this.mapService.searchRadius} km)`;
		this.mapView.zoom = zoomOptions[this.mapService.searchRadiusIndex];
		this.mapView.removeAllMarkers();
		this.mapView.removeAllShapes();
		this.subscriptions.push(this.mapService
			.getClosestTo(this.currentPosition.latitude, this.currentPosition.longitude, this.mapService.searchRadius)
			.subscribe((findings: any[]) => {
				findings.map(val => {
					val.found_at = new Date(val.found_at);
					val.position = Position.positionFromLatLng(val.lat, val.lon);
				});
				this.closestFindings = findings;
				this.setupAdMarkers();
			}));
		this.setupSearchCircle();
	}

	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}
}
