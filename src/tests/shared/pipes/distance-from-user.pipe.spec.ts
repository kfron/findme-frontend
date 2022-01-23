import 'reflect-metadata';
import { Position } from 'nativescript-google-maps-sdk';
import { DistanceFromPipe } from '../../../app/shared/pipes/distance-from-user.pipe';

// A sample Jasmine test
describe('distance-from-user pipe', function () {
	const pipe = new DistanceFromPipe();

	it('should return 0 as distance between two equal points', function () {
		const pos = Position.positionFromLatLng(51, 20);

		expect(pipe.transform(pos, pos)).toEqual('0 meters away');
	});

	it('should return proper distance between two different points', function () {
		const pos1 = Position.positionFromLatLng(50, 20);
		const pos2 = Position.positionFromLatLng(52, 22);

		expect(pipe.transform(pos1, pos2)).toEqual('262.74 km away');
	});
});
