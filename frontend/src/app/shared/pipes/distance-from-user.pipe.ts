import { Position } from 'nativescript-google-maps-sdk';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distanceFrom'
})
export class DistanceFromPipe implements PipeTransform {

  private round(n: number): number {
    return Math.round(n * 100) / 100;
  }

  transform(a: Position, b: Position): string {
    let R = 6371.0710; // Radius of the Earth in miles
    let rlat1 = a.latitude * (Math.PI / 180); // Convert degrees to radians
    let rlat2 = b.latitude * (Math.PI / 180); // Convert degrees to radians
    let difflat = rlat2 - rlat1; // Radian difference (latitudes)
    let difflon = (b.longitude - a.longitude) * (Math.PI / 180); // Radian difference (longitudes)

    let d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));

    let finalDist = Math.round(d * 1000);
    let result = '';

    finalDist / 1000 < 1 ? result = finalDist + ' meters away' : result = this.round((finalDist / 1000)) + ' km away' 
    return result;
  }

}
