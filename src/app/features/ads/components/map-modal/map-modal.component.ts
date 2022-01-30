import { Finding } from '../../../../shared/models/map.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';
import { Circle, MapView, Marker, MarkerEventData, Polyline, Position, PositionEventData, Style } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { LocationService } from '../../../../shared/services/location.service';
import { MapService } from '../../../../shared/services/map.service';

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

	/**
	 * Pobiera kontekst wywołania z parametrów.
	 * Przewiduje dwa tryby pracy - tryb zgłaszania napotkania i tryb rysowania ścieżki.
	 */
	ngOnInit(): void {
		if (this.params.context.pinpointMode !== undefined) {
			this.pinpointMode = false;
			this.adId = this.params.context.adId;
			this.adPosition = this.params.context.adPosition;
		}
	}

	/**
	 * Przerywa wszystkie aktywne subskrypcje w momencie zniszczenia komponentu.
	 */
	ngOnDestroy(): void {
		while (this.subscriptions.length != 0) {
			const sub = this.subscriptions.pop();
			sub.unsubscribe();
		}
	}

	/**
	 * Zdarzenie aktywowane przez komponent MapView.
	 * Inicjalizuje mapę, ustawia jej parametry i w zależności od trybu:
	 * 	- zgłaszanie napotkania : daje możliwość ustawienia znacznika
	 * 	- rysowania ścieżki: pobiera najnowszy element ścieżki i wywołuje funkcję rysowania
	 * 
	 * @param event - obiekt zawierający odniesienie do mapy
	 */
	async onMapReady(event) {
		this.mapView = event.object as MapView;
		
		if (this.pinpointMode) {
			this.currentLocation = await this.locationService.getCurrentLocation();
			alert({
				title: 'Tip',
				okButtonText: 'Got it!',
				message: 'TAP to place a marker.\nDRAG to change it\'s position.'
			});

			this.mapView.latitude = this.currentLocation.latitude;
			this.mapView.longitude = this.currentLocation.longitude;
		} else {

			this.mapView.latitude = this.adPosition.latitude;
			this.mapView.longitude = this.adPosition.longitude;
		}
		
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
						(val: Finding[]) => this.drawRoute(val[0].id)
					)
			);
		}

	}

	/**
	 * Resetuje obecnie narysowaną ścieżkę, pobiera dane do nowej.
	 * Dla każdego punktu na ścieżce dodaje okrąg oznaczający prawdopodobny zasięg oddalenia się.
	 * Wszystkie punkty połączone zostają linią.
	 * 
	 * @param startId - id napotkania, który stanowi najnowszy element ścieżki 
	 */
	drawRoute(startId) {
		this.subscriptions.push(
			this.mapService.getPath(startId)
				.subscribe((findings: Finding[]) => {
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
	onCoordinateTap(event: PositionEventData) {
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
	 * Obsługuje zatwierdzenie wyboru przez użytkownika. Zamyka okno i przesyła dane zwrotne.
	 */
	onSubmitTap() {
		this.params.closeCallback(this.markerPosition);
	}

	/**
	 * Obsługa przycisku powrotu - nawiguje do poprzedniej strony.
	 */
	onBackButtonTap() {
		this.params.closeCallback();
	}
}
