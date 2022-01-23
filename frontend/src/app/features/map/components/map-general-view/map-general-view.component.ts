import { Component, OnDestroy, OnInit } from '@angular/core';
import { registerElement, RouterExtensions } from '@nativescript/angular';
import { Color, NavigatedData, Page } from '@nativescript/core';
import { Circle, MapView, Marker, MarkerEventData, Polyline, Position, Shape, Style } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { MapService } from '../../../../shared/services/map.service';
import { Finding } from './../../../../shared/models/map.model';
import { LocationService } from './../../../../shared/services/location.service';

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

	// Key - ad id, Value - marker
	// Marker mapped to the ad should always represent the newest location in path
	private closestMap: Map<number, Marker> = new Map();

	// Helper array to manage path
	private pathAdId: number = null;
	private shapePath: Shape[] = [];

	private searchCircle: Circle;

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
				(val) => {
					this.currentPosition = val;
					this.updateSearchCircle();
					if (this.mapView !== undefined) {
						this.subscriptions.push(this.mapService
							.getClosestTo(this.currentPosition.latitude, this.currentPosition.longitude, this.mapService.searchRadius)
							.subscribe((findings: Finding[]) => {
								this.closestFindings = findings;
								this.setupAdMarkers();
							})
						);
						this.updateSearchCircle();
					}
				}
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
			.subscribe((findings: Finding[]) => {
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
		// synchronise currently displayed markers with new set of findings
		this.closestMap.forEach(
			(value, key) => {
				const finding = this.closestFindings.find(finding => finding.ad_id === key);
				// finding that is currently displayed, but was not returned in latest http call should be removed
				if (finding === undefined) {
					if (key === this.pathAdId && this.shapePath.length !== 0)
						this.clearPath();
					this.mapView.removeMarker(value);
					this.closestMap.delete(key);
				} else {
					// map that keeps the markers maps them based on the id of ad that they belong to - check if the finding for that ad is new
					if (value.userData.id !== finding.id) {
						value.position = finding.position;
						value.userData = {
							id: finding.id,
							ad_id: finding.ad_id,
							found_at: finding.found_at,
							prev_id: finding.prev_id,
							next_id: finding.next_id
						};
						value.title = `${finding.name}, ${finding.age}`;
						value.snippet = this.formatTimeSnippet(finding.found_at);
						this.closestMap.set(key, value);
					}
					const id = this.closestFindings.indexOf(finding);
					this.closestFindings.splice(id, 1);
				}
			}
		);

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
			this.closestMap.set(find.ad_id, marker);
			this.mapView.addMarker(marker);
		}


	}

	setupSearchCircle() {
		this.searchCircle = new Circle();
		this.searchCircle.center = this.currentPosition;
		this.searchCircle.radius = this.mapService.searchRadius * 1000;
		this.searchCircle.visible = true;
		this.searchCircle.fillColor = new Color(15, 85, 209, 250);
		this.searchCircle.strokeColor = new Color('#559cfa');
		this.searchCircle.strokeWidth = 2;
		this.mapView.addCircle(this.searchCircle);
	}

	updateSearchCircle() {
		this.searchCircle.center = this.currentPosition;
		this.searchCircle.radius = this.mapService.searchRadius * 1000;
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

	clearPath() {
		this.shapePath.forEach(val => this.mapView.removeShape(val));
		this.shapePath = [];
	}

	drawLine(startId: number) {
		this.clearPath();
		this.subscriptions.push(this.mapService
			.getPath(startId)
			.subscribe((findings: Finding[]) => {
				this.pathAdId = findings[0].ad_id;
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
					this.shapePath.push(circle);
					this.mapView.addCircle(circle);
				});
				polyline.visible = true;
				polyline.width = 4;
				polyline.color = this.mapService.pathColor;
				polyline.geodesic = false;
				this.shapePath.push(polyline);
				this.mapView.addPolyline(polyline);

				return path;
			}));

	}

	onInfoWindowTap(event: MarkerEventData) {
		if (event.marker.userData?.id) {
			this.mapService.navigateTo(['/home/ad-details', event.marker.userData.ad_id]);
		}
	}

	onNavigatedTo(data: NavigatedData) {
		if (data.isBackNavigation) {
			this.updateSearchCircle();
			this.subscriptions.push(this.mapService
				.getClosestTo(this.currentPosition.latitude, this.currentPosition.longitude, this.mapService.searchRadius)
				.subscribe((findings: Finding[]) => {
					this.closestFindings = findings;
					this.setupAdMarkers();
				}));
		}
	}

	onToggleRadiusTap() {
		this.mapService.toggleSearchRadius();
		this.toggleRadiusText = `Toggle radius (${this.mapService.searchRadius} km)`;
		this.mapView.zoom = zoomOptions[this.mapService.searchRadiusIndex];
		this.subscriptions.push(this.mapService
			.getClosestTo(this.currentPosition.latitude, this.currentPosition.longitude, this.mapService.searchRadius)
			.subscribe((findings: Finding[]) => {
				this.closestFindings = findings;
				this.setupAdMarkers();
			}));
		this.updateSearchCircle();
	}

	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}
}
