import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { MapGeneralViewComponent } from './components/map-general-view/map-general-view.component';
import { MapPingComponent } from './components/map-ping/map-ping.component';
import { MapRoutingModule } from './map-routing.module';

const components = [
	MapGeneralViewComponent,
	MapPingComponent
];

const modules = [
	MapRoutingModule,
	NativeScriptCommonModule,
	NativeScriptUIListViewModule,
	NativeScriptLocalizeModule,
	NativeScriptHttpClientModule
];

@NgModule({
	declarations: components,
	imports: modules,
	schemas: [NO_ERRORS_SCHEMA]
})
export class MapModule { }
