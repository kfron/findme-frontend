import { TimeSinceDatePipe } from './time-since-date.pipe';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DistanceFromPipe } from './distance-from-user.pipe';

const pipes = [
	TimeSinceDatePipe,
	DistanceFromPipe
];

@NgModule({
	declarations: pipes,
	exports: pipes,
	imports: [],
	schemas: [NO_ERRORS_SCHEMA],
})
export class PipesModule { }
