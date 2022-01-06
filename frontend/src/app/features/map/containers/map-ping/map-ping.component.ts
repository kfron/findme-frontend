import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MapService } from './../../map.service';
import { CoreTypes, EventData } from '@nativescript/core';
import { registerElement, RouterExtensions } from '@nativescript/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapView, PositionEventData, Style, Marker, MarkerEventData, Position } from 'nativescript-google-maps-sdk';
import { getCurrentLocation, Location } from '@nativescript/geolocation';

registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

@Component({
  moduleId: module.id,
  selector: 'fm-map-ping',
  templateUrl: './map-ping.component.html',
  styleUrls: ['./map-ping.component.scss']
})
export class MapPingComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []

  mapView: MapView
  currentLocation: Location
  isEnabled: boolean = false
  markerPosition: Position

  constructor(
    private mapSerivce: MapService,
    private activatedRoute: ActivatedRoute,
    private routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    while (this.subscriptions.length != 0) {
      var sub = this.subscriptions.pop();
      sub.unsubscribe();
    }
  }

  async onMapReady(event) {
    this.currentLocation = await getCurrentLocation({
      desiredAccuracy: CoreTypes.Accuracy.high,
      maximumAge: 5000,
      timeout: 20000
    });

    alert({
      title: "Tip",
      okButtonText: "Got it!",
      message: `TAP to place a marker.\nDRAG to change it's position.`
    });

    this.mapView = event.object as MapView;
    this.mapView.latitude = this.currentLocation.latitude;
    this.mapView.longitude = this.currentLocation.longitude;
    this.mapView.zoom = 13;
    this.mapView.setStyle(<Style>JSON.parse(
      `[
        {
          "featureType": "poi.business",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]`)
    );


  }

  onMarkerSelect(event: MarkerEventData) {
    this.mapView.removeAllMarkers();
    this.markerPosition = null
    this.isEnabled = false;
  }

  onCoordinateTapped(event: PositionEventData) {
    this.mapView.removeAllMarkers();

    let marker = new Marker();
    marker.position = event.position;
    marker.draggable = true;
    this.mapView.addMarker(marker);
    this.markerPosition = marker.position
    this.isEnabled = true;
  }

  onMarkerDrag(event: MarkerEventData) {
    this.markerPosition = event.marker.position;
  }

  onSubmitTapped(event: EventData) {
    const adId = +this.activatedRoute.snapshot.params.adId
    this.subscriptions.push(
      this.mapSerivce
        .createFinding(adId, 
                       this.markerPosition.latitude, 
                       this.markerPosition.longitude)
        .subscribe()
    );
    alert({
      title: "Pong!",
      okButtonText: "OK",
      message: "Finding submitted."
    });
    this.routerExtensions.back();
  }

}
