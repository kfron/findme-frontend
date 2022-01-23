import { HttpClient } from '@angular/common/http';
import { Position } from 'nativescript-google-maps-sdk';
import { of } from 'rxjs';
import { Ad } from '~/app/shared/models/ads.model';
import { User } from '~/app/shared/models/auth.model';
import { UserService } from '~/app/shared/services/user.service';
import { environment } from '../../../../environment';

describe('UserService', function () {

	let userService: UserService;

	let http: jasmine.SpyObj<HttpClient>;

	beforeEach(() => {
		http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
		userService = new UserService(http);
	});

	it('#login should make an API call and set current user', function (done: DoneFn) {
		const res: User = { id: 15, email: 'test', password: 'test' };

		http.post.and.returnValue(of(res));

		userService.login(res.email, res.password).subscribe({
			next: (user) => {
				expect(user).toEqual(res);
				done();
			},
			error: done.fail
		});

		expect(userService.currentUser).toEqual(res);
		expect(http.post.calls.count()).withContext('one call').toBe(1);
	});

	it('#signup should make an API call and set current user', function (done: DoneFn) {
		const res: User = { id: 15, email: 'test', password: 'test' };

		http.post.and.returnValue(of(res));

		userService.signup(res).subscribe({
			next: (user) => {
				expect(user).toEqual(res);
				done();
			},
			error: done.fail
		});

		expect(userService.currentUser).toEqual(res);
		expect(http.post.calls.count()).withContext('one call').toBe(1);
	});

	it('#changeEmail should make an API call and set current user', function (done: DoneFn) {
		const oldUser: User = { id: 15, email: 'test', password: 'test' };
		const newUser: User = { id: 15, email: 'test2', password: 'test' };
		userService.currentUser = oldUser;

		http.put.and.returnValue(of(newUser));

		userService.changeEmail('test2').subscribe({
			next: (user) => {
				expect(user).toEqual(newUser);
				done();
			},
			error: done.fail
		});

		expect(userService.currentUser).toEqual(newUser);
		expect(http.put.calls.count()).withContext('one call').toBe(1);
	});

	it('#changePassword should make an API call and set current user', function (done: DoneFn) {
		const oldUser: User = { id: 15, email: 'test', password: 'test' };
		const newUser: User = { id: 15, email: 'test2', password: 'test' };
		userService.currentUser = oldUser;

		http.put.and.returnValue(of(newUser));

		userService.changePassword('test').subscribe({
			next: (user) => {
				expect(user).toEqual(newUser);
				done();
			},
			error: done.fail
		});

		expect(userService.currentUser).toEqual(newUser);
		expect(http.put.calls.count()).withContext('one call').toBe(1);
	});

	it('#getMyAds should make an API call and set return mapped ads', function (done: DoneFn) {
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

		userService.currentUser = { id: 1 } as User;

		http.get.and.returnValue(of(unmappedAds));

		userService.getMyAds().subscribe({
			next: (user) => {
				expect(user).toEqual(mappedAds);
				done();
			},
			error: done.fail
		});

		expect(http.get.calls.count()).withContext('one call').toBe(1);
	});

	it('#getMyPings should make an API call and set return mapped ads', function (done: DoneFn) {
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

		userService.currentUser = { id: 1 } as User;

		http.get.and.returnValue(of(unmappedAds));

		userService.getMyPings().subscribe({
			next: (user) => {
				expect(user).toEqual(mappedAds);
				done();
			},
			error: done.fail
		});

		expect(http.get.calls.count()).withContext('one call').toBe(1);
	});
});