import 'reflect-metadata';
import { TimeSinceDatePipe } from './../../../app/shared/pipes/time-since-date.pipe';

// A sample Jasmine test
describe('distance-from-user pipe', function () {
	const pipe = new TimeSinceDatePipe();

	it('should return 0 for current date', function () {
		const now = new Date();

		expect(pipe.transform(now)).toEqual('seconds ago');
	});
});
