import { Position } from 'nativescript-google-maps-sdk';
import 'reflect-metadata';
import { DistanceFromPipe } from '../app/shared/pipes/distance-from-user.pipe';

// A sample Jasmine test
describe('A suite', function () {
	const pos1 = Position.positionFromLatLng(51, 20);
	const pos2 = Position.positionFromLatLng(51, 20);
	const pipe = new DistanceFromPipe();
	it('contains spec with an expectation', function () {
		expect(pipe.transform(pos1, pos2)).toEqual('0 meters away');
	});
});
