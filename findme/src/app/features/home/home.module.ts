import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { MissingPetAdListComponent } from './containers/missing-pet-ad-list/missing-pet-ad-list.component';
import { HomeRoutingModule } from './home-routing.module';

const components = [
  MissingPetAdListComponent
]

@NgModule({
  declarations: components,
  imports: [HomeRoutingModule, NativeScriptCommonModule, NativeScriptUIListViewModule, NativeScriptLocalizeModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
