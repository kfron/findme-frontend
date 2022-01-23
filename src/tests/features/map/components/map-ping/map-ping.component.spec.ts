import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { MapView, Position, PositionEventData } from 'nativescript-google-maps-sdk';
import { of } from 'rxjs';
import { MapService } from '~/app/shared/services/map.service';
import { MapPingComponent } from './../../../../../app/features/map/components/map-ping/map-ping.component';

describe('MapPingComponent', function () {
	let component: MapPingComponent;
	let fixture: ComponentFixture<MapPingComponent>;
	let mapService: jasmine.SpyObj<MapService>;
	let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
	let routerExtensions: jasmine.SpyObj<RouterExtensions>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MapPingComponent],
			providers: [
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['createFinding']) },
				{ provide: ActivatedRoute, useValue: jasmine.createSpyObj('ActivatedRoute', [''], { snapshot: { params: { adId: 1 } } }) },
				{ provide: RouterExtensions, useValue: jasmine.createSpyObj('RouterExtensions', ['back']) }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(MapPingComponent);
		component = fixture.componentInstance as MapPingComponent;

		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
		activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
		routerExtensions = TestBed.inject(RouterExtensions) as jasmine.SpyObj<RouterExtensions>;
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

		component.onCoordinateTapped(event);

		expect(component.mapView.removeAllMarkers).toHaveBeenCalledTimes(1);
		expect(component.mapView.addMarker).toHaveBeenCalledTimes(1);
		expect(component.markerPosition).toEqual(event.position);
		expect(component.isEnabled).toEqual(true);
	});

	it('#onSubmitTapped should call for finding creation and navigate back', function (done: DoneFn) {
		mapService.createFinding.and.returnValue(of());
		component.markerPosition = { latitude: 50, longitude: 20 } as Position;

		component.onSubmitTapped();

		expect(mapService.createFinding).toHaveBeenCalledOnceWith(1, 50, 20);
		expect(routerExtensions.back).toHaveBeenCalledTimes(1);

		done();
	});

});