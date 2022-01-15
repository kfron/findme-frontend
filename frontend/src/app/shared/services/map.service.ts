import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Color } from '@nativescript/core';
import { Position } from 'nativescript-google-maps-sdk';
import { Observable, tap } from 'rxjs';
import { Finding } from './../models/map.model';
import { UserService } from './user.service';


@Injectable({
	providedIn: 'root'
})
export class MapService {
	//private serverUrl = "https://mysterious-inlet-42373.herokuapp.com/";
	private serverUrl = 'http://10.0.2.2:5000/';
	private _searchRadiuses = [0.5, 1, 5];
	private _searchRadiusIndex = 0;

	public pathColor = new Color('#DD00b3fd');
	public circleStrokeColor = new Color('#2b6616');
	public circleFillColor = new Color(30, 106, 212, 68);

	constructor(
		private http: HttpClient,
		private userService: UserService) { }

	private mapFinding(finding): Finding {
		finding.found_at = new Date(finding.found_at);
		finding.position = Position.positionFromLatLng(finding.lat, finding.lon);
		finding.lat = undefined;
		finding.lon = undefined;

		return finding as Finding;
	}

	get searchRadius() {
		return this._searchRadiuses[this._searchRadiusIndex];
	}

	get searchRadiusIndex() {
		return this._searchRadiusIndex;
	}

	toggleSearchRadius() {
		this._searchRadiusIndex = (this._searchRadiusIndex + 1) % 3;
	}

	getClosestTo(lat: number, lon: number, dist: number): Observable<Finding[]> {
		const params = new HttpParams()
			.set('lat', lat)
			.set('lon', lon)
			.set('dist', dist);

		const observable = this.http.get(this.serverUrl + 'map/getClosestTo', { params }) as Observable<any[]>;

		return (observable.pipe(tap(findings => {
			findings.map(finding => this.mapFinding(finding));
		})) as Observable<Finding[]>);
	}

	getPath(startId: number): Observable<Finding[]> {
		const params = new HttpParams()
			.set('startId', startId);

		const observable = (this.http.get(this.serverUrl + 'map/getPath', { params }) as Observable<any[]>);

		return (observable.pipe(tap(findings => {
			findings.map(finding => this.mapFinding(finding));
		})) as Observable<Finding[]>);
	}

	getNewestFinding(adId: number) {
		const params = new HttpParams()
			.set('adId', adId);

		const observable = (this.http.get(this.serverUrl + 'map/getNewestFinding', { params }) as Observable<any[]>);

		return (observable.pipe(tap(findings => {
			findings.map(finding => this.mapFinding(finding));
		})) as Observable<Finding[]>);
	}

	createFinding(adId: number, lat: number, lon: number) {
		const userId = this.userService.currentUser.id;
		return (this.http.post(this.serverUrl + 'map/createFinding', { adId, userId, lat, lon }));
	}
}
