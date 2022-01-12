import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Request, session } from '@nativescript/background-http';
import { Observable } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { MapService } from './../map/map.service';
import { Ad } from './ads.model';

@Injectable({
	providedIn: 'root'
})
export class HomeService {
	//private serverUrl = "https://mysterious-inlet-42373.herokuapp.com/";
	private serverUrl = 'http://10.0.2.2:5000/';

	constructor(
		private http: HttpClient,
		private authService: AuthService,
		private routerExtensions: RouterExtensions,
		private mapService: MapService) { }

	getAdsList(lat, lon): Observable<Ad[]> {
		const params = new HttpParams()
			.set('lat', lat)
			.set('lon', lon)
			.set('dist', this.mapService.searchRadius);
		return (this.http.get(this.serverUrl + 'ads/getAdsList', { params }) as Observable<Ad[]>);
	}

	getAdByid(id: number): Observable<Ad[]> {
		return (this.http.get(this.serverUrl + 'ads/getAd?id=' + id) as Observable<Ad[]>);
	}

	createAd(name, age, image, description, pos: string) {
		const split = pos.split(' ');
		const lat = +split[0];
		const lon = +split[1];
		const sess = session('file-upload');
		const request = {
			url: this.serverUrl + 'ads/createAd',
			method: 'POST'
		} as Request;
		const params = [
			{ name: 'userId', value: this.authService.currentUser.id },
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

	updateAd(id, name, age, image, description) {
		const res = this.http.put(this.serverUrl + 'ads/updateAd', { id: id, name: name, age: age, image: image, description: description });
		return res;
	}

	deleteAd(id) {
		const params = new HttpParams().set('id', id);
		return this.http.delete(this.serverUrl + 'ads/deleteAd', { params: params });
	}

}
