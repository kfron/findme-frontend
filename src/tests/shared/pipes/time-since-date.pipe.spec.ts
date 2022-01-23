import 'reflect-metadata';
import { TimeSinceDatePipe } from './../../../app/shared/pipes/time-since-date.pipe';

// A sample Jasmine test
describe('TimeSinceDatePipe', function () {
	const pipe = new TimeSinceDatePipe();

	it('#transform should return 0 for current date', function () {
		const now = new Date();

		expect(pipe.transform(now)).toEqual('seconds ago');
	});

	it('#transform should return proper time for past date', function () {
		const now = new Date();
		const timeInMiliseconds =
			840000 + // 14 minutes
			25200000 + // 7 hours
			259200000 + // 3 days
			604800000; // 1 week
		const then = now.valueOf() - timeInMiliseconds;

		expect(pipe.transform(new Date(then))).toEqual('1 week 3 days ago');
	});
});
