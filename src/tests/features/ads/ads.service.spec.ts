import { HttpClient } from '@angular/common/http';
import { RouterExtensions } from '@nativescript/angular';
import { Position } from 'nativescript-google-maps-sdk';
import { of } from 'rxjs';
import { User } from '~/app/shared/models/auth.model';
import { MapService } from '~/app/shared/services/map.service';
import { UserService } from '~/app/shared/services/user.service';
import { environment } from './../../../../environment';
import { AdsService } from './../../../app/features/ads/ads.service';
import { Ad } from './../../../app/shared/models/ads.model';

describe('AdsService', function () {
	let adsService: AdsService;
	let http: jasmine.SpyObj<HttpClient>;
	let userService: jasmine.SpyObj<UserService>;
	let routerExtensions: jasmine.SpyObj<RouterExtensions>;
	let mapService: jasmine.SpyObj<MapService>;

	beforeEach(() => {
		http = jasmine.createSpyObj('HttpClient', ['get', 'put', 'delete']);
		userService = jasmine.createSpyObj('UserService', [], { currentUser: { id: 1 } as User });
		routerExtensions = jasmine.createSpyObj('RouterExtensions', ['back']);
		mapService = jasmine.createSpyObj('MapService', [], { searchRadius: 5 });
		adsService = new AdsService(http, userService, routerExtensions, mapService);
	});

	it('#getAdsList should make an API call and return properly mapped ads', function (done: DoneFn) {
		const unmappedAds = [
			{ id: 1, image: 'test-dog.jpg', found_at: '2022-01-02T18:26:45.215Z', lat: 51.591452, lon: 21.562075 },
			{ id: 2, image: 'test-dog.jpg', found_at: '2022-01-02T18:37:30.024Z', lat: 51.591452, lon: 21.562075 },
			{ id: 3, image: 'test-dog.jpg', found_at: '2022-01-02T18:41:07.860Z', lat: 51.591452, lon: 21.562075 },
			{ id: 4, image: 'test-dog.jpg', found_at: '2022-01-02T18:41:07.860Z', lat: 51.591452, lon: 21.562075 }
		];
		const mappedAds = [
			{ id: 1, image: environment.baseUrl + '/test-dog.jpg', found_at: new Date('2022-01-02T18:26:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 2, image: environment.baseUrl + '/test-dog.jpg', found_at: new Date('2022-01-02T18:37:30.024Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 3, image: environment.baseUrl + '/test-dog.jpg', found_at: new Date('2022-01-02T18:41:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad,
			{ id: 4, image: environment.baseUrl + '/test-dog.jpg', found_at: new Date('2022-01-02T18:41:07.860Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad
		];

		http.get.and.returnValue(of(unmappedAds));

		adsService.getAdsList(50, 21).subscribe({
			next: (ads) => {
				expect(ads).toEqual(mappedAds);
				done();
			},
			error: done.fail
		});

		expect(http.get).toHaveBeenCalledTimes(1);
	});

	it('#getAdByid should make an API call and return properly mapped ad', function (done: DoneFn) {
		const unmappedAd = { id: 1, image: 'test-dog.jpg', found_at: '2022-01-02T18:26:45.215Z', lat: 51.591452, lon: 21.562075 };
		const mappedAd = { id: 1, image: environment.baseUrl + '/test-dog.jpg', found_at: new Date('2022-01-02T18:26:45.215Z'), lastKnownPosition: Position.positionFromLatLng(51.591452, 21.562075) } as Ad;

		http.get.and.returnValue(of(unmappedAd));

		adsService.getAdByid(1).subscribe({
			next: (ad) => {
				expect(ad).toEqual(mappedAd);
				done();
			},
			error: done.fail
		});

		expect(http.get).toHaveBeenCalledTimes(1);
	});

});