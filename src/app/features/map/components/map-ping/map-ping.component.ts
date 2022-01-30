import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { registerElement, RouterExtensions } from '@nativescript/angular';
import { MapView, Marker, MarkerEventData, Position, PositionEventData, Style } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { MapService } from '../../../../shared/services/map.service';
import { LocationService } from './../../../../shared/services/location.service';

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
	currentPosition: Position
	isEnabled = false
	markerPosition: Position

	constructor(
		private mapSerivce: MapService,
		private activatedRoute: ActivatedRoute,
		private routerExtensions: RouterExtensions,
		private locationService: LocationService
	) { }

	/**
	 * Przerywa istniejące subskrypcje, gdy komponent zostaje zniszczony
	 */
	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	/**
	 * Zdarzenie aktywowane przez komponent MapView.
	 * Inicjalizuje mapę i ustawia jej parametry.
	 * 
	 * @param event - obiekt zawierający odniesienie do mapy
	 */
	async onMapReady(event) {
		this.currentPosition = await this.locationService.getCurrentLocation();

		alert({
			title: 'Tip',
			okButtonText: 'Got it!',
			message: 'TAP to place a marker.\nDRAG to change it\'s position.'
		});

		this.mapView = event.object as MapView;
		this.mapView.latitude = this.currentPosition.latitude;
		this.mapView.longitude = this.currentPosition.longitude;
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

	/**
	 * Obsługuje zdarzenie naciśnięcia znacznika - usuwa go.
	 */
	onMarkerSelect() {
		this.mapView.removeAllMarkers();
		this.markerPosition = null;
		this.isEnabled = false;
	}

	/**
	 * Obsługuje zdarzenie naciśnięcia miejsca na mapie - tworzy w tym miejscu nowy znacznik.
	 * 
	 * @param event - dane zdarzenia wygenerowanego po naciśnięciu mapy
	 */
	onCoordinateTapped(event: PositionEventData) {
		this.mapView.removeAllMarkers();

		const marker = new Marker();
		marker.position = event.position;
		marker.draggable = true;
		this.mapView.addMarker(marker);
		this.markerPosition = marker.position;
		this.isEnabled = true;
	}

	/**
	 * Obsługuje zdarzenie przesunięcia znacznika na mapie.
	 * 
	 * @param event - dane zdarzenia wygenerowanego przez przeciągnięcie znacznika.
	 */
	onMarkerDrag(event: MarkerEventData) {
		this.markerPosition = event.marker.position;
	}

	/**
	 * Obsługuje zatwierdzenie wyboru przez użytkownika.
	 * Wysyła żądanie stworzenia nowego napotkania.
	 * Wyświetla okno informacyjne i nawiguje do poprzedniej strony.
	 */
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
