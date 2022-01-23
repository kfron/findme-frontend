import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { MapGeneralViewComponent } from './components/map-general-view/map-general-view.component';
import { MapPingComponent } from './components/map-ping/map-ping.component';


const routes: Routes = [
	{ path: '', component: MapGeneralViewComponent },
	{ path: 'ping/:adId', component: MapPingComponent }
];

@NgModule({
	imports: [NativeScriptRouterModule.forChild(routes)],
	exports: [NativeScriptRouterModule],
})
export class MapRoutingModule { }
