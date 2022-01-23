import { HttpClient } from '@angular/common/http';
import { RouterExtensions } from '@nativescript/angular';
import { Position } from 'nativescript-google-maps-sdk';
import { of } from 'rxjs';
import { User } from '~/app/shared/models/auth.model';
import { Finding } from '~/app/shared/models/map.model';
import { MapService } from '~/app/shared/services/map.service';
import { UserService } from '~/app/shared/services/user.service';

describe('MapService', function () {
	let mapService: MapService;
	let http: jasmine.SpyObj<HttpClient>;
	let userService: jasmine.SpyObj<UserService>;
	let routerExtensions: jasmine.SpyObj<RouterExtensions>;

	beforeEach(() => {
		http = jasmine.createSpyObj('HttpClient', ['get', 'post']);
		userService = jasmine.createSpyObj('UserService', [], { currentUser: { id: 1 } as User });
		routerExtensions = jasmine.createSpyObj('RouterExtensions', ['navigate']);
		mapService = new MapService(http, userService, routerExtensions);
	});

	it('#getClosestTo should make an API call and return properly mapped findings', function (done: DoneFn) {
		const findingsBeforeMapping =
			[
				{ id: 2, ad_id: 1, found_at: '2022-01-02T18:26:45.215Z', lat: 51.591452, lon: 21.562075, name: 'test' },
				{ id: 3, ad_id: 1, found_at: '2022-01-02T18:37:30.024Z', lat: 51.579773, lon: 21.568683, name: 'test' },
				{ id: 4, ad_id: 2, found_at: '2022-01-02T18:41:07.860Z', lat: 51.585053, lon: 21.530146, name: 'test2' }
			];
		const mappedFindings =
			[
				{ id: 2, ad_id: 1, found_at: new Date('2022-01-02T18:26:45.215Z'), position: Position.positionFromLatLng(51.591452, 21.562075), name: 'test' } as Finding,
				{ id: 3, ad_id: 1, found_at: new Date('2022-01-02T18:37:30.024Z'), position: Position.positionFromLatLng(51.579773, 21.568683), name: 'test' } as Finding,
				{ id: 4, ad_id: 2, found_at: new Date('2022-01-02T18:41:07.860Z'), position: Position.positionFromLatLng(51.585053, 21.530146), name: 'test2' } as Finding
			];

		http.get.and.returnValue(of(findingsBeforeMapping));

		mapService.getClosestTo(51, 21, 10).subscribe({
			next: (findings) => {
				expect(findings).toEqual(mappedFindings);
				done();
			},
			error: done.fail
		});

		expect(http.get.calls.count()).withContext('one call').toBe(1);
	});

	it('#getPath should make an API call and return properly mapped path', function (done: DoneFn) {
		const unmappedFindings =
			[
				{ id: 1, ad_id: 1, found_at: '2022-01-02T18:26:45.215Z', lat: 51.591452, lon: 21.562075, prev_id: null, next_id: 2 },
				{ id: 2, ad_id: 1, found_at: '2022-01-02T18:37:30.024Z', lat: 51.591452, lon: 21.562075, prev_id: 1, next_id: 4 },
				{ id: 4, ad_id: 1, found_at: '2022-01-02T18:41:07.860Z', lat: 51.591452, lon: 21.562075, prev_id: 2, next_id: 7 },
				{ id: 7, ad_id: 1, found_at: '2022-01-02T18:41:07.860Z', lat: 51.591452, lon: 21.562075, prev_id: 4, next_id: null }
			];
		const mappedFindings =
			[
				{ id: 1, ad_id: 1, found_at: new Date('2022-01-02T18:26:45.215Z'), position: Position.positionFromLatLng(51.591452, 21.562075), prev_id: null, next_id: 2 } as Finding,
				{ id: 2, ad_id: 1, found_at: new Date('2022-01-02T18:37:30.024Z'), position: Position.positionFromLatLng(51.591452, 21.562075), prev_id: 1, next_id: 4 } as Finding,
				{ id: 4, ad_id: 1, found_at: new Date('2022-01-02T18:41:07.860Z'), position: Position.positionFromLatLng(51.591452, 21.562075), prev_id: 2, next_id: 7 } as Finding,
				{ id: 7, ad_id: 1, found_at: new Date('2022-01-02T18:41:07.860Z'), position: Position.positionFromLatLng(51.591452, 21.562075), prev_id: 4, next_id: null } as Finding
			];

		http.get.and.returnValue(of(unmappedFindings));

		mapService.getPath(7).subscribe({
			next: (findings) => {
				expect(findings).toEqual(mappedFindings);
				done();
			},
			error: done.fail
		});

		expect(http.get.calls.count()).withContext('one call').toBe(1);
	});

	it('#getNewestFinding should make an API call and return properly mapped finding', function (done: DoneFn) {
		const unmappedFindings =
			[
				{ id: 1, ad_id: 1, found_at: '2022-01-02T18:26:45.215Z', lat: 51.591452, lon: 21.562075, prev_id: null, next_id: 2 }
			];
		const mappedFindings =
			[
				{ id: 1, ad_id: 1, found_at: new Date('2022-01-02T18:26:45.215Z'), position: Position.positionFromLatLng(51.591452, 21.562075), prev_id: null, next_id: 2 } as Finding
			];

		http.get.and.returnValue(of(unmappedFindings));

		mapService.getNewestFinding(1).subscribe({
			next: (findings) => {
				expect(findings).toEqual(mappedFindings);
				done();
			},
			error: done.fail
		});

		expect(http.get.calls.count()).withContext('one call').toBe(1);
	});

	it('#createFinding should make an API call and return', function (done: DoneFn) {
		const args = [1, 51.591452, 21.562075];
		const unmappedFindings =
			[
				{ id: 1, ad_id: args[0], found_at: '2022-01-02T18:26:45.215Z', lat: args[1], lon: args[2], prev_id: null, next_id: 2 }
			];

		http.post.and.returnValue(of(unmappedFindings));

		mapService.createFinding(args[0], args[1], args[2]).subscribe({
			next: (findings) => {
				expect(findings).toEqual(unmappedFindings);
				done();
			},
			error: done.fail
		});

		expect(http.post.calls.count()).withContext('one call').toBe(1);
	});

});