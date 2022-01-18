import { ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalDialogService, RouterExtensions } from '@nativescript/angular';
import { NavigatedData, Page } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { of } from 'rxjs';
import { AdsService } from '~/app/features/ads/ads.service';
import { User } from '~/app/shared/models/auth.model';
import { LocationService } from '~/app/shared/services/location.service';
import { MapService } from '~/app/shared/services/map.service';
import { UserService } from '~/app/shared/services/user.service';
import { MissingPetAdDetailsComponent } from './../../../../../app/features/ads/components/missing-pet-ad-details/missing-pet-ad-details.component';
import { Ad } from './../../../../../app/shared/models/ads.model';

describe('MissingPetAdDetailsComponent', function () {
	let component: MissingPetAdDetailsComponent;
	let fixture: ComponentFixture<MissingPetAdDetailsComponent>;

	let userService: jasmine.SpyObj<UserService>;
	let mapService: jasmine.SpyObj<MapService>;
	let locationService: jasmine.SpyObj<LocationService>;
	let adsService: jasmine.SpyObj<AdsService>;
	let page: Page;
	let vcRef: ViewContainerRef;
	let modalService: ModalDialogService;
	let routerExtensions: jasmine.SpyObj<RouterExtensions>;
	let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

	const position = Position.positionFromLatLng(51, 21);

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MissingPetAdDetailsComponent],
			providers: [
				{ provide: UserService, useValue: jasmine.createSpyObj('UserService', [], { currentUser: { id: 1 } as User }) },
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['toggleSearchRadius', 'navigateTo'], { searchRadius: 1 }) },
				{ provide: LocationService, useValue: jasmine.createSpyObj('LocationService', ['getCurrentLocation'], { position$: of(position) }) },
				{ provide: AdsService, useValue: jasmine.createSpyObj('AdsService', ['getAdByid']) },
				{ provide: Page },
				{ provide: ViewContainerRef },
				{ provide: ModalDialogService },
				{ provide: RouterExtensions, useValue: jasmine.createSpyObj('RouterExtensions', ['backToPreviousPage']) },
				{ provide: ActivatedRoute, useValue: jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { params: { id: 1 } } }) }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(MissingPetAdDetailsComponent);
		component = fixture.componentInstance as MissingPetAdDetailsComponent;

		userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
		locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
		adsService = TestBed.inject(AdsService) as jasmine.SpyObj<AdsService>;
		page = TestBed.inject(Page);
		vcRef = TestBed.inject(ViewContainerRef);
		modalService = TestBed.inject(ModalDialogService);
		routerExtensions = TestBed.inject(RouterExtensions) as jasmine.SpyObj<RouterExtensions>;
		activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
	});

	it('#ngOnInit should call for ad using id from route parameters and set variables properly', function (done: DoneFn) {
		const ad = { id: 1, user_id: 1, age: 5, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		adsService.getAdByid.and.returnValue(of(ad));
		done();

		component.ngOnInit();

		expect(component.ad).toEqual(ad);
		expect(component.owner).toEqual(true);
		expect(component.options.context.adPosition).toEqual(ad.lastKnownPosition);
		expect(adsService.getAdByid).toHaveBeenCalledOnceWith(1);
	});

	it('#onNavigatedTo should reload ad and set variables properly on back navigation', function (done: DoneFn) {
		const data: NavigatedData = { isBackNavigation: true } as NavigatedData;
		const adBefore = { id: 1, user_id: 1, age: 5, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		const adAfter = { id: 1, user_id: 2, age: 5, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		component.ad = adBefore;
		adsService.getAdByid.and.returnValue(of(adAfter));
		done();

		component.onNavigatedTo(data);

		expect(component.ad).toEqual(adAfter);
		expect(component.owner).toEqual(false);
		expect(adsService.getAdByid).toHaveBeenCalledOnceWith(1);
	});

});