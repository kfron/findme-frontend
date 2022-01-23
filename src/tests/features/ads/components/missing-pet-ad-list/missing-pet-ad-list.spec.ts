import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservableArray, Page } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { of } from 'rxjs';
import { AdsService } from '~/app/features/ads/ads.service';
import { Ad } from '~/app/shared/models/ads.model';
import { LocationService } from '~/app/shared/services/location.service';
import { MapService } from '~/app/shared/services/map.service';
import { MissingPetAdListComponent } from './../../../../../app/features/ads/components/missing-pet-ad-list/missing-pet-ad-list.component';

describe('MissingPetAdListComponent', function () {
	let component: MissingPetAdListComponent;
	let fixture: ComponentFixture<MissingPetAdListComponent>;
	let mapService: jasmine.SpyObj<MapService>;
	let locationService: jasmine.SpyObj<LocationService>;
	let adsService: jasmine.SpyObj<AdsService>;
	let page: Page;
	const position = Position.positionFromLatLng(51, 21);

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [MissingPetAdListComponent],
			providers: [
				{ provide: MapService, useValue: jasmine.createSpyObj('MapService', ['toggleSearchRadius', 'navigateTo'], { searchRadius: 1 }) },
				{ provide: LocationService, useValue: jasmine.createSpyObj('LocationService', ['getCurrentLocation'], { position$: of(position) }) },
				{ provide: AdsService, useValue: jasmine.createSpyObj('AdsService', ['getAdsList']) },
				{ provide: Page }
			]
		}).compileComponents();
		fixture = TestBed.createComponent(MissingPetAdListComponent);
		component = fixture.componentInstance as MissingPetAdListComponent;

		mapService = TestBed.inject(MapService) as jasmine.SpyObj<MapService>;
		locationService = TestBed.inject(LocationService) as jasmine.SpyObj<LocationService>;
		adsService = TestBed.inject(AdsService) as jasmine.SpyObj<AdsService>;
		page = TestBed.inject(Page);
	});

	it('#onSortByDateTap should properly sort by date ascending by default and set sorting flag', function () {
		const unsortedAds = [
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];

		const sortedAds = [
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];
		component.ads = new ObservableArray(unsortedAds);

		component.onSortByDateTap();

		expect(component.ads).toEqual(new ObservableArray(sortedAds));
		expect(component.sortByDate).toEqual(true);
	});

	it('#onSortByDateTap should properly sort by date descending and set sorting flag', function () {
		const unsortedAds = [
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];

		const sortedAds = [
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];
		component.ads = new ObservableArray(unsortedAds);
		component.sortByDate = true;

		component.onSortByDateTap();

		expect(component.ads).toEqual(new ObservableArray(sortedAds));
		expect(component.sortByDate).toEqual(true);
	});

	it('#onSortByAgeTap should properly sort by age ascending by default and set sorting flag', function () {
		const unsortedAds = [
			{ id: 1, age: 5, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, age: 12, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 3, age: 13, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 4, age: 2, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];

		const sortedAds = [
			{ id: 4, age: 2, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 1, age: 5, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, age: 12, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 3, age: 13, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];
		component.ads = new ObservableArray(unsortedAds);

		component.onSortByAgeTap();

		expect(component.ads).toEqual(new ObservableArray(sortedAds));
		expect(component.sortByAge).toEqual(true);
	});

	it('#onSortByAgeTap should properly sort by age descending and set sorting flag', function () {
		const unsortedAds = [
			{ id: 1, age: 5, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, age: 12, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 3, age: 13, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 4, age: 2, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];

		const sortedAds = [
			{ id: 3, age: 13, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, age: 12, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 1, age: 5, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 4, age: 2, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];
		component.ads = new ObservableArray(unsortedAds);
		component.sortByAge = true;

		component.onSortByAgeTap();

		expect(component.ads).toEqual(new ObservableArray(sortedAds));
		expect(component.sortByAge).toEqual(true);
	});

	it('#onSortByProximityTap should properly sort by proximity ascending by default and set sorting flag', function () {
		const unsortedAds = [
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.5, 21.5) } as Ad,
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.1, 21.2) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(52.1, 21) } as Ad,
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(54, 19) } as Ad
		];

		const sortedAds = [
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.1, 21.2) } as Ad,
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.5, 21.5) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(52.1, 21) } as Ad,
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(54, 19) } as Ad
		];
		component.ads = new ObservableArray(unsortedAds);
		component.currentPosition = Position.positionFromLatLng(51, 21);

		component.onSortByProximityTap();

		expect(component.ads).toEqual(new ObservableArray(sortedAds));
		expect(component.sortByProximity).toEqual(true);
	});

	it('#onSortByProximityTap should properly sort by proximity descending and set sorting flag', function () {
		const unsortedAds = [
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.5, 21.5) } as Ad,
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.1, 21.2) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(52.1, 21) } as Ad,
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(54, 19) } as Ad
		];

		const sortedAds = [
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(54, 19) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(52.1, 21) } as Ad,
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.5, 21.5) } as Ad,
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.1, 21.2) } as Ad
		];
		component.ads = new ObservableArray(unsortedAds);
		component.currentPosition = Position.positionFromLatLng(51, 21);

		component.sortByProximity = true;

		component.onSortByProximityTap();

		expect(component.ads).toEqual(new ObservableArray(sortedAds));
		expect(component.sortByProximity).toEqual(true);
	});

	it('#onToggleRadiusTapped should invoke radius toggle and subscribe for new ads', function () {
		const ads = [
			{ id: 4, found_at: new Date('2022-01-08T13:41:07.550Z'), lastKnownPosition: Position.positionFromLatLng(54, 19) } as Ad,
			{ id: 3, found_at: new Date('2022-01-12T18:21:07.860Z'), lastKnownPosition: Position.positionFromLatLng(52.1, 21) } as Ad,
			{ id: 1, found_at: new Date('2022-02-01T17:16:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.5, 21.5) } as Ad,
			{ id: 2, found_at: new Date('2022-01-08T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.1, 21.2) } as Ad
		];

		adsService.getAdsList.and.returnValue(of(ads));
		component.currentPosition = position;

		component.onToggleRadiusTapped();

		expect(component.ads).toEqual(new ObservableArray(ads));

		expect(adsService.getAdsList).toHaveBeenCalledOnceWith(position.latitude, position.longitude);
	});

});