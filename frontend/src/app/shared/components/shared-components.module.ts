import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { AdsListComponent } from './ads-list/ads-list.component';
import { PipesModule } from '../pipes/pipes.module';

const components = [
	AdsListComponent
];

const modules = [
	NativeScriptCommonModule,
	NativeScriptUIListViewModule,
	PipesModule
];

@NgModule({
	declarations: components,
	exports: components,
	imports: modules,
	schemas: [NO_ERRORS_SCHEMA]
})
export class SharedComponentsModule { }
