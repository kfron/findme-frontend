import { TimeSinceDatePipe } from './../../../../shared/pipes/time-since-date.pipe';
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

	/**
	 * Klucz - id zgłoszenia, Wartość - znacznik
	 * Znacznik zmapowany do zgłoszenia powinien zawsze reprezentować najnowszą lokalizację na ścieżce
	 */
	private closestMap: Map<number, Marker> = new Map();

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
		private timeSinceDatePipe: TimeSinceDatePipe,
		private page: Page) {
		this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
	}

	/**
	 * Rozpoczyna obserwację aktualnej pozycji urządzenia - w razie zmiany przesuwa wizualizację promienia wyszukiwania.
	 * Jeśli ogłoszenie znajdzie się poza zasięgiem wyszukiwania liczonym od obecnej pozycji, to zostaje usunięte z mapy.
	 * Jeśli ogłoszenie znajdzie się w zasięgu - zostaje dodane.
	 */
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
	 * Pobiera zgłoszenia z okolicy urządzenia.
	 * Wywołuje funkcje rysowania znaczników i okrągu zasięgu wyszukiwania. 
	 * 
	 * @param event - obiekt zawierający odniesienie do mapy
	 */
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

	/**
	 * Obsługuje zdarzenie naciśnięcia znacznika na mapie.
	 * Wyświetla okno z wybranymi informacjami zgłoszenia.
	 * 
	 * @param event - dane zdarzenia naciśniecia znacznika. 
	 */
	onMarkerSelect(event: MarkerEventData) {
		if (event.marker.userData?.id) {
			event.marker.snippet = this.timeSinceDatePipe.transform(event.marker.userData.found_at);
			this.drawLine(event.marker.userData.id);
		}
	}

	/**
	 * Weryfikuje zmapowane zgłoszenia z nowo-pobranymi.
	 * Usuwa ze słownika te, które są poza zasięgiem. Dodaje te, których wcześniej nie było. 
	 * 
	 */
	setupAdMarkers() {

		// Blok odpowiedzialny za usunięcie zgłoszeń spoza zasięgu, lub aktualizację mapowania, jeśli jest w zasięgu, ale zmieniły się dane.
		this.closestMap.forEach(
			(value, key) => {
				const finding = this.closestFindings.find(finding => finding.ad_id === key);
				if (finding === undefined) {
					if (key === this.pathAdId && this.shapePath.length !== 0)
						this.clearPath();
					this.mapView.removeMarker(value);
					this.closestMap.delete(key);
				} else {
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
						value.snippet = this.timeSinceDatePipe.transform(finding.found_at);
						this.closestMap.set(key, value);
					}
					const id = this.closestFindings.indexOf(finding);
					this.closestFindings.splice(id, 1);
				}
			}
		);

		// Dodanie do mapy wizualizacji zgłoszeń, których nie zostały usunięte w poprzednim bloku, czyli są nowe.
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
			marker.snippet = this.timeSinceDatePipe.transform(find.found_at);
			this.closestMap.set(find.ad_id, marker);
			this.mapView.addMarker(marker);
		}


	}

	/**
	 * Inicjalizuje okrąg przedstawiający zasięg wyświetlania zgłoszeń i dodaje go do mapy.
	 */
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

	/**
	 * Aktualizuje pozycję i promień okrągu zasięgu wyświetlania zgłoszeń.
	 */
	updateSearchCircle() {
		this.searchCircle.center = this.currentPosition;
		this.searchCircle.radius = this.mapService.searchRadius * 1000;
	}

	/**
	 * Usuwa z mapy kształty tworzącę wyświetlaną ścieżkę i resetuje tablicę.
	 */
	clearPath() {
		this.shapePath.forEach(val => this.mapView.removeShape(val));
		this.shapePath = [];
	}

	/**
	 * Pobiera ścieżkę i rysuje na mapie jej wizualizację złożoną z linii i okrągów.
	 * 
	 * @param startId - id zgłoszenia, dla którego zwrócić ścieżkę
	 */
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

	/**
	 * Obsługa zdarzenia wywołanego przez naciśnięcie okienka wyświetlonego po dotknięciu znacznika na mapie.
	 * Nawiguje do widoku szczegółowego zgłoszenia, którego dotyczy znacznik.
	 * 
	 * @param event - dane zdarzenia naciśnięcia znacznika.
	 */
	onInfoWindowTap(event: MarkerEventData) {
		if (event.marker.userData?.id) {
			this.mapService.navigateTo(['/home/ad-details', event.marker.userData.ad_id]);
		}
	}

	/**
	 * Obsługuje zdarzenie cofnięcia się z innego widoku do tego komponentu
	 * @param data - Dane wygenerowane ze zdarzenia nawigacji
	 */
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

	/**
	 * Obsługuje przycisk zmiany zasięgu poszukiwań.
	 * Aktualizuje wyświetlany napis, ustawia odpowiedni zoom i pobiera nową ilość zgłoszeń z okolicy.
	 * Usuwa aktywną ścieżkę i aktualizuje okrąg poszukiwań.
	 */
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
		this.clearPath();
		this.updateSearchCircle();
	}

	/**
	 * Obsługa przycisku powrotu - nawiguje do poprzedniej strony.
	 */
	onBackButtonTap() {
		this.routerExtensions.backToPreviousPage();
	}
}
