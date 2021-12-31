import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MapRoutingModule } from './map-routing.module';
import { MapGeneralViewComponent } from './containers/map-general-view/map-general-view.component';

const components = [
  MapGeneralViewComponent
]

const modules = [
  MapRoutingModule,
  NativeScriptCommonModule,
  NativeScriptUIListViewModule,
  NativeScriptLocalizeModule,
  NativeScriptHttpClientModule
]

@NgModule({
  declarations: components,
  imports: modules,
  schemas: [NO_ERRORS_SCHEMA]
})
export class MapModule { }
