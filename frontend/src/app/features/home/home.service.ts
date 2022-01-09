import { RouterExtensions } from '@nativescript/angular';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { Ad } from './ads.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  //private serverUrl = "https://mysterious-inlet-42373.herokuapp.com/";
  private serverUrl = "http://10.0.2.2:5000/";
  private dist = 0.05;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private routerExtensions: RouterExtensions) { }

  getAdsList(lat, lon): Observable<Ad[]> {
    let params = new HttpParams()
      .set('lat', lat)
      .set('lon', lon)
      .set('dist', this.dist);
    return (this.http.get(this.serverUrl + "ads/getAdsList", { params }) as Observable<Ad[]>);
  }

  getAdByid(id: number): Observable<Ad[]> {
    return (this.http.get(this.serverUrl + "ads/getAd?id=" + id) as Observable<Ad[]>);
  }

  createAd(name, age, image, description, lat, lon) {
    var bghttp = require('@nativescript/background-http');
    var session = bghttp.session('file-upload');
    var request = {
      url: this.serverUrl + "ads/createAd",
      method: 'POST'
    }
    var params = [
      { name: 'userId', value: this.authService.currentUser.id },
      { name: 'name', value: name },
      { name: 'age', value: age },
      { name: 'image', filename: image, mimeType: "image/jpeg" },
      { name: 'description', value: description },
      { name: 'lat', value: lat},
      { name: 'lon', value: lon}];

    var task = session.multipartUpload(params, request);

    task.on("error", (e) => {
      console.log(e);
      console.log('error uploading file to server')
    });

    task.on("responded", (e) => {
      alert({
        title: "Success!",
        okButtonText: "Great!",
        message: "Thank you!\nLet's find this pet!"
      });
      this.routerExtensions.back();
    })
  }

  updateAd(id, name, age, image, description) {
    let res = this.http.put(this.serverUrl + "ads/updateAd", { id: id, name: name, age: age, image: image, description: description });
    return res;
  }

  deleteAd(id) {
    let params = new HttpParams().set('id', id);
    return this.http.delete(this.serverUrl + 'ads/deleteAd', { params: params });
  }

}
