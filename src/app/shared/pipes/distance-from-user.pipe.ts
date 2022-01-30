import { Position } from 'nativescript-google-maps-sdk';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'distanceFrom'
})
export class DistanceFromPipe implements PipeTransform {

	private round(n: number): number {
		return Math.round(n * 100) / 100;
	}

	/**
	 * Oblicza przybliżoną, rzeczywistą odległość pomiędzy dwoma punktami.
	 * Wynik jest formatowany pod kątem rzędu wielkości. Jeśli odległość to mniej niż 1 kilometr
	 * to wynik jest w metrach, jeśli więcej to w kilometrach.
	 * 
	 * @param a - współrzędne kartograficzne pierwszego punktu
	 * @param b - współrzędne kartograficzne drugiego punktu
	 * @returns sformatowaną odległość między podanymi punktami w postaci napisu 
	 */
	transform(a: Position, b: Position): string {
		const R = 6371.0710; // Radius of the Earth in miles
		const rlat1 = a.latitude * (Math.PI / 180); // Convert degrees to radians
		const rlat2 = b.latitude * (Math.PI / 180); // Convert degrees to radians
		const difflat = rlat2 - rlat1; // Radian difference (latitudes)
		const difflon = (b.longitude - a.longitude) * (Math.PI / 180); // Radian difference (longitudes)

		const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));

		const finalDist = Math.round(d * 1000);
		let result = '';

		finalDist / 1000 < 1 ? result = finalDist + ' meters away' : result = this.round((finalDist / 1000)) + ' km away'; 
		return result;
	}

}
