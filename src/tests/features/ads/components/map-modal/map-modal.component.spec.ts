import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDialogParams } from '@nativescript/angular';
import { Color, Page } from '@nativescript/core';
import { MapView, Position, PositionEventData } from 'nativescript-google-maps-sdk';
import { of } from 'rxjs';
import { MapModalComponent } from './../../../../../app/features/ads/components/map-modal/map-modal.component';
import { Finding } from './../../../../../app/shared/models/map.model';
import { LocationService } from './../../../../../app/shared/services/location.service';
import { MapService } from './../../../../../app/shared/services/map.service';

describe('MapModalComponent', function () {
	let component: MapModalComponent;
	let fixture: ComponentFixture<MapModalComponent>;

	let params: jasmine.SpyObj<ModalDialogParams>;
	let locationService: jasmine.SpyObj<LocationService>;
	let mapService: jasmine.SpyObj<MapService>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MapModalComponent],
			providers: [
				{ provide: ModalDialogParams, useValue: jasmine.createSpyObj('ModalDialogParams', ['closeCallback']) },
				{ provide: LocationService, useValue: jasmine.createSpyObj('LocationService', ['getCurrentLocation']) },
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['getNewestFinding', 'getPath'], { circleFillColor: new Color(30, 106, 212, 68), circleStrokeColor: new Color('#2b6616'), pathColor: new Color('#DD00b3fd') }) },
				{ provide: Page }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(MapModalComponent);
		component = fixture.componentInstance as MapModalComponent;

		params = TestBed.inject(ModalDialogParams) as jasmine.SpyObj<ModalDialogParams>;
		locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
	});

	it('#ngOnInit should properly set flags based on context from parent component', function () {
		delete params.context;
		params.context = {};

		component.ngOnInit();

		expect(component.pinpointMode).toEqual(true);
		expect(component.adId).toEqual(undefined);
		expect(component.adPosition).toEqual(undefined);
	});

	it('#ngOnInit should properly set flags based on context from parent component', function () {
		delete params.context;
		params.context = {
			pinpointMode: false,
			adId: 1,
			adPosition: Position.positionFromLatLng(50, 20)
		};

		component.ngOnInit();

		expect(component.pinpointMode).toEqual(false);
		expect(component.adId).toEqual(1);
		expect(component.adPosition).toEqual(Position.positionFromLatLng(50, 20));
	});

	it('#drawRoute should send a request for path and properly prepare visuals (circles and polyline)', function () {
		const findings = [
			{ position: Position.positionFromLatLng(51, 20) } as Finding,
			{ position: Position.positionFromLatLng(52, 20) } as Finding,
			{ position: Position.positionFromLatLng(53, 21) } as Finding,
			{ position: Position.positionFromLatLng(53, 22) } as Finding,
			{ position: Position.positionFromLatLng(52, 22) } as Finding,
			{ position: Position.positionFromLatLng(51, 23) } as Finding,
		];
		component.mapView = new MapView();
		mapService.getPath.and.returnValue(of(findings));
		spyOn(component.mapView, 'removeAllShapes').and.returnValue();
		spyOn(component.mapView, 'addCircle').and.returnValue();
		spyOn(component.mapView, 'addPolyline').and.returnValue();

		component.drawRoute(1);

		expect(mapService.getPath).toHaveBeenCalledOnceWith(1);
		expect(component.mapView.removeAllShapes).toHaveBeenCalledTimes(1);
		expect(component.mapView.addCircle).toHaveBeenCalledTimes(findings.length);
		expect(component.mapView.addPolyline).toHaveBeenCalledTimes(1);
	});

	it('#onMarkerSelect should reset all markers', function () {
		component.mapView = new MapView();
		spyOn(component.mapView, 'removeAllMarkers').and.returnValue();

		component.onMarkerSelect();

		expect(component.mapView.removeAllMarkers).toHaveBeenCalledTimes(1);
		expect(component.markerPosition).toEqual(null);
		expect(component.isEnabled).toEqual(false);
	});

	it('#onCoordinateTap should reset all markers and then add a new one', function () {
		const event = { position: Position.positionFromLatLng(51, 20) } as PositionEventData;
		component.mapView = new MapView();
		spyOn(component.mapView, 'removeAllMarkers').and.returnValue();
		spyOn(component.mapView, 'addMarker').and.returnValue();

		component.onCoordinateTap(event);

		expect(component.mapView.removeAllMarkers).toHaveBeenCalledTimes(1);
		expect(component.mapView.addMarker).toHaveBeenCalledTimes(1);
		expect(component.markerPosition).toEqual(event.position);
		expect(component.isEnabled).toEqual(true);
	});
});