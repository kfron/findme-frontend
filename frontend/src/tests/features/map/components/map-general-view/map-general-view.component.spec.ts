import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import { MarkerEventData, Position } from 'nativescript-google-maps-sdk';
import { of } from 'rxjs';
import { MapService } from '~/app/shared/services/map.service';
import { MapGeneralViewComponent } from './../../../../../app/features/map/components/map-general-view/map-general-view.component';
import { LocationService } from './../../../../../app/shared/services/location.service';

describe('MapGeneralViewComponent', function () {
	let component: MapGeneralViewComponent;
	let fixture: ComponentFixture<MapGeneralViewComponent>;
	let mapService: jasmine.SpyObj<MapService>;
	let routerExtensions: jasmine.SpyObj<RouterExtensions>;
	let locationService: jasmine.SpyObj<LocationService>;
	const position = Position.positionFromLatLng(51, 21);

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MapGeneralViewComponent],
			providers: [
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['createFinding']) },
				{ provide: RouterExtensions, useValue: jasmine.createSpyObj('RouterExtensions', ['backToPreviousPage']) },
				{ provide: LocationService, useValue: jasmine.createSpyObj('LocationService', ['getCurrentLocation'], { position$: of(position) }) },
				{ provide: Page }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(MapGeneralViewComponent);
		component = fixture.componentInstance as MapGeneralViewComponent;

		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
		routerExtensions = TestBed.inject(RouterExtensions) as jasmine.SpyObj<RouterExtensions>;
		locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
	});

	/*it('#onMarkerSelect should use event data to call formatting and to draw a line', function () {
		const date = new Date('2022-01-02T18:26:45.215Z');
		const event = {
			marker: {
				userData: {
					id: 1,
					found_at: date
				},
				snippet: null
			}
		} as MarkerEventData;
		spyOn(component, 'formatTimeSnippet').and.returnValue('');
		spyOn(component, 'drawLine').and.returnValue();

		component.onMarkerSelect(event);

		expect(component.formatTimeSnippet).toHaveBeenCalledOnceWith(event.marker.userData.found_at);
		expect(component.drawLine).toHaveBeenCalledOnceWith(event.marker.userData.id);

	});*/
});