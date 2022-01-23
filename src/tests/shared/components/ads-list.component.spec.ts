import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Position } from 'nativescript-google-maps-sdk';
import { ListViewEventData } from 'nativescript-ui-listview';
import { of } from 'rxjs';
import { AdsListComponent } from '~/app/shared/components/ads-list/ads-list.component';
import { Ad } from '~/app/shared/models/ads.model';
import { LocationService } from '~/app/shared/services/location.service';
import { MapService } from '~/app/shared/services/map.service';

describe('AdsListComponent', function () {
	let component: AdsListComponent;
	let fixture: ComponentFixture<AdsListComponent>;
	let mapService: jasmine.SpyObj<MapService>;
	let locationService: jasmine.SpyObj<LocationService>;
	const position = Position.positionFromLatLng(51, 21);

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [AdsListComponent],
			providers: [
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['navigateTo']) },
				{ provide: LocationService, useValue: jasmine.createSpyObj('LocationService', ['getCurrentLocation'], { position$: of(position) }) }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(AdsListComponent);
		component = fixture.componentInstance as AdsListComponent;

		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
		locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
	});

	it('#ngOnInit should call for current location', function (done: DoneFn) {
		locationService.getCurrentLocation.and.resolveTo(position);
		done();

		component.ngOnInit();

		expect(locationService.getCurrentLocation).toHaveBeenCalledTimes(1);
	});

	it('#onAdItemTap should navigate with proper arguments', function () {
		const args: ListViewEventData = new ListViewEventData();
		spyOnProperty(args, 'view').and.returnValue({ bindingContext: { id: 1 } as Ad });

		component.onAdItemTap(args);

		expect(mapService.navigateTo).toHaveBeenCalledOnceWith(['/home/ad-details', 1]);
	});

});