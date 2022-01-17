import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Request, session } from '@nativescript/background-http';
import { Position } from 'nativescript-google-maps-sdk';
import { map, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ad } from '~/app/shared/models/ads.model';
import { UserService } from '~/app/shared/services/user.service';
import { MapService } from '../../shared/services/map.service';
import { ApiPaths, environment } from './../../../../environment';


@Injectable({
	providedIn: 'root'
})
export class AdsService {
	baseUrl = environment.baseUrl;

	constructor(
		private http: HttpClient,
		private userService: UserService,
		private routerExtensions: RouterExtensions,
		private mapService: MapService) { }

	private mapAd(ad): Ad {
		ad.found_at = new Date(ad.found_at);
		ad.image = `${this.baseUrl}/${ad.image}`;
		ad.lastKnownPosition = Position.positionFromLatLng(ad.lat, ad.lon);
		ad.lat = undefined;
		ad.lon = undefined;
		return ad as Ad;
	}

	getAdsList(lat, lon): Observable<Ad[]> {
		const url = `${this.baseUrl}/${ApiPaths.ads}/getAdsList`;
		const params = new HttpParams()
			.set('lat', lat)
			.set('lon', lon)
			.set('dist', this.mapService.searchRadius);

		const observable = (this.http.get(url, { params }) as Observable<any[]>);

		return (observable.pipe(tap(ads => {
			ads.map(ad => this.mapAd(ad));
		})) as Observable<Ad[]>);
	}

	getAdByid(id: number): Observable<Ad> {
		const url = `${this.baseUrl}/${ApiPaths.ads}/getAd`;
		const params = new HttpParams()
			.set('id', id);
		const observable = (this.http.get(url, { params }) as Observable<Ad>);

		return (observable.pipe(map(ad => this.mapAd(ad))) as Observable<Ad>);
	}

	createAd(name, age, image, description, pos: string) {
		const url = `${this.baseUrl}/${ApiPaths.ads}/createAd`;
		const split = pos.split(' ');
		const lat = +split[0];
		const lon = +split[1];
		const sess = session('file-upload');
		const request = {
			url: url,
			method: 'POST'
		} as Request;
		const params = [
			{ name: 'userId', value: this.userService.currentUser.id },
			{ name: 'name', value: name },
			{ name: 'age', value: age },
			{ name: 'image', filename: image, mimeType: 'image/jpeg' },
			{ name: 'description', value: description },
			{ name: 'lat', value: lat },
			{ name: 'lon', value: lon }];

		const task = sess.multipartUpload(params, request);

		task.on('error', (e) => {
			console.log(e);
			console.log('error uploading file to server');
		});

		task.on('responded', () => {
			alert({
				title: 'Success!',
				okButtonText: 'Great!',
				message: 'Thank you!\nLet\'s find this pet!'
			});
			this.routerExtensions.back();
		});
	}

	updateAdWithImage(id, name, age, image, description) {
		const url = `${this.baseUrl}/${ApiPaths.ads}/updateAd`;
		const sess = session('file-upload');
		const request = {
			url: url,
			method: 'PUT'
		} as Request;
		const params = [
			{ name: 'id', value: id },
			{ name: 'name', value: name },
			{ name: 'age', value: age },
			{ name: 'image', filename: image, mimeType: 'image/jpeg' },
			{ name: 'description', value: description }];

		const task = sess.multipartUpload(params, request);

		task.on('error', (e) => {
			console.log(e);
			console.log('error uploading file to server');
		});

		task.on('responded', () => {
			alert({
				title: 'Success!',
				okButtonText: 'OK',
				message: 'Ad updated.'
			});
		});
	}

	updateAdWithoutImage(id, name, age, description) {
		const url = `${this.baseUrl}/${ApiPaths.ads}/updateAd`;
		const params = new HttpParams()
			.set('id', id)
			.set('name', name)
			.set('age', age)
			.set('description', description);

		return this.http.put(url, params);
	}

	deleteAd(id) {
		const url = `${this.baseUrl}/${ApiPaths.ads}/deleteAd`;
		const params = new HttpParams().set('id', id);
		return this.http.delete(url, { params });
	}

}
