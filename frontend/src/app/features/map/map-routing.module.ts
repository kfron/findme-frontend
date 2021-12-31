import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { MapGeneralViewComponent } from './containers/map-general-view/map-general-view.component';


const routes: Routes = [
  { path: '', component: MapGeneralViewComponent }
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class MapRoutingModule { }
