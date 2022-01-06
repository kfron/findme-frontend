import { Component, OnDestroy, OnInit } from '@angular/core';
import { registerElement, RouterExtensions } from '@nativescript/angular';
import { Color, CoreTypes, NavigatedData, Page } from '@nativescript/core';
import { getCurrentLocation, Location } from '@nativescript/geolocation';
import { Circle, MapView, Marker, MarkerEventData, Polyline, Position, PositionEventData, Style } from 'nativescript-google-maps-sdk';
import { Subscription } from 'rxjs';
import { Finding } from './../../map.model';
import { MapService } from './../../map.service';

registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);

@Component({
  moduleId: module.id,
  selector: 'fm-map-general-view',
  templateUrl: './map-general-view.component.html',
  styleUrls: ['./map-general-view.component.scss']
})
export class MapGeneralViewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []

  closestFindings: Array<Finding> = []
  mapView: MapView
  currentLocation: Location

  constructor(
    private mapService: MapService,
    private routerExtensions: RouterExtensions,
    private page: Page) {
      this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
    }

  ngOnInit(): void {
  }

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
    })

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
      ]`));
      
    let marker = new Marker();
    marker.position = Position.positionFromLatLng(this.currentLocation.latitude, this.currentLocation.longitude);
    marker.title = `It's you!`;
    marker.snippet = "You";
    this.mapView.addMarker(marker);

    this.subscriptions.push(this.mapService
      .getClosestTo(this.currentLocation.latitude, this.currentLocation.longitude, 0.05)
      .subscribe((findings: any[]) => {
        findings.map(val => {
          val.found_at = new Date(val.found_at);
          val.position = Position.positionFromLatLng(val.lat, val.lon);
        });
        this.closestFindings = findings;
        this.setupMarkers();
      }))
  }

  onMarkerSelect(event: MarkerEventData) {
    if (event.marker.userData?.id) {
      event.marker.snippet = this.formatTimeSnippet(event.marker.userData.found_at);
      this.drawLine(event.marker.userData.id);
    }
  }

  setupMarkers() {
    for (let i = 0; i < this.closestFindings.length; i++) {
      let marker = new Marker();
      let find = this.closestFindings[i];
      marker.position = find.position;
      marker.userData =
      {
        id: find.id,
        ad_id: find.ad_id,
        found_at: find.found_at,
        prev_id: find.prev_id,
        next_id: find.next_id
      }
      marker.title = `${find.name}, ${find.age}`
      marker.snippet = this.formatTimeSnippet(find.found_at);
      this.mapView.addMarker(marker);
    }
  }

  formatTimeSnippet(foundAt: Date) {
    let now = new Date();
    let diff = Math.abs(now.valueOf() - foundAt.valueOf());
    let weeks = Math.floor(diff / 604800000);
    let days = Math.floor((diff - weeks * 604800000) / 86400000);
    let hours = Math.floor((diff - weeks * 604800000 - days * 86400000) / 3600000);
    let minutes = Math.floor((diff - weeks * 604800000 - days * 86400000 - hours * 3600000) / 60000);
    let result = '';
    result += weeks === 1 ? ' week ' : weeks > 1 ? ' weeks ' : ''
    result += days === 1 ? days + ' day ' : days > 1 ? days + ' days ' : ''
    //if (weeks > 0 ) return result + 'ago'
    result += hours === 1 ? hours + ' hour ' : hours > 1 ? hours + ' hours ' : ''
    //if (days > 0 ) return result + 'ago'
    result += minutes === 1 ? minutes + ' minute ' : minutes > 1 ? minutes + ' minutes ' : ''
    return result + 'ago'
  }

  drawLine(startId: number) {
    this.subscriptions.push(this.mapService
      .getPath(startId)
      .subscribe((findings: any[]) => {
        findings.map(val => {
          val.position = Position.positionFromLatLng(val.lat, val.lon);
        });
        this.mapView.removeAllShapes();
        let path = []
        findings.forEach(find => {
          path.push(find.position)
        })

        const polyline = new Polyline();
        path.forEach(pos => {
          polyline.addPoint(pos);
          let circle = new Circle();
          circle.center = pos;
          circle.radius = 500;this.subscriptions.push(this.mapService
            .getClosestTo(this.currentLocation.latitude, this.currentLocation.longitude, 0.05)
            .subscribe((findings: any[]) => {
              findings.map(val => {
                val.found_at = new Date(val.found_at);
                val.position = Position.positionFromLatLng(val.lat, val.lon);
              });
              this.closestFindings = findings;
              this.setupMarkers();
            }))
          circle.visible = true;
          circle.fillColor = new Color(30, 106, 212, 68);
          circle.strokeColor = new Color('#2b6616');
          circle.strokeWidth = 2;
          this.mapView.addCircle(circle);
        });
        polyline.visible = true;
        polyline.width = 4;
        polyline.color = new Color("#DD00b3fd");
        polyline.geodesic = false;
        this.mapView.addPolyline(polyline);

        return path;
      }))

  }

  onInfoWindowTapped(event: MarkerEventData) {
    if(event.marker.userData?.id) {
      this.routerExtensions.navigate(['/home/ad-details', event.marker.userData.ad_id], {
        animated: true,
        transition: {
          name: 'slide',
          duration: 200,
          curve: 'ease',
        }
      })
    }
  }

  onNavigatedTo(data: NavigatedData) {
    if (data.isBackNavigation) {
      this.mapView.removeAllMarkers();
      this.mapView.removeAllShapes();
      this.subscriptions.push(this.mapService
        .getClosestTo(this.currentLocation.latitude, this.currentLocation.longitude, 0.05)
        .subscribe((findings: any[]) => {
          findings.map(val => {
            val.found_at = new Date(val.found_at);
            val.position = Position.positionFromLatLng(val.lat, val.lon);
          });
          this.closestFindings = findings;
          this.setupMarkers();
        }))
    }
  }
}
