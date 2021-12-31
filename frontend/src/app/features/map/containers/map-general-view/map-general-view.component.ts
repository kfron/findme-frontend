import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import * as geolocation from '@nativescript/geolocation';
import { CoreTypes } from '@nativescript/core';

registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

@Component({
  moduleId: module.id,
  selector: 'fm-map-general-view',
  templateUrl: './map-general-view.component.html',
  styleUrls: ['./map-general-view.component.scss']
})
export class MapGeneralViewComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }

  async onMapReady(event) {
    console.log("Map Ready");

    const location = await geolocation.getCurrentLocation({
      desiredAccuracy: CoreTypes.Accuracy.high,
      maximumAge: 5000,
      timeout: 20000
    })

    let mapView = event.object as MapView;

    mapView.latitude = location.latitude;
    mapView.longitude = location.longitude;
    mapView.zoom = 10;
    var marker = new Marker();
    marker.position = Position.positionFromLatLng(location.latitude, location.longitude);
    marker.title = "Kozienice";
    marker.snippet = "Polska";
    marker.userData = { index: 1};
    mapView.addMarker(marker);
  }

  onMarkerSelect(event) {
    console.log(event.marker);
  }

}
