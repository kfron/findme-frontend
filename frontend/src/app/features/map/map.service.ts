import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './../auth/auth.service';
@Injectable({
    providedIn: 'root'
})
export class MapService {
    //private serverUrl = "https://mysterious-inlet-42373.herokuapp.com/";
    private serverUrl = "http://10.0.2.2:5000/";

    constructor(private http: HttpClient, private authService: AuthService) { }

    getClosestTo(lat: number, lon: number, dist: number): Observable<any[]> {
        let params = new HttpParams()
            .set('lat', lat)
            .set('lon', lon)
            .set('dist', dist);
        return (this.http.get(this.serverUrl + 'map/getClosestTo', { params: params }) as Observable<any[]>);
    }

    getPath(startId: number): Observable<any[]> {
        let params = new HttpParams()
            .set('startId', startId);
        return (this.http.get(this.serverUrl + 'map/getPath', { params: params }) as Observable<any[]>);
    }

    createFinding(adId: number, lat: number, lon: number) {
        return (this.http.post(this.serverUrl + 'map/createFinding', {adId, lat, lon}));
    }
}
