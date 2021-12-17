import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { MissingPetAdDetailsComponent } from './containers/missing-pet-ad-details/missing-pet-ad-details.component';
import { MissingPetAdListComponent } from './containers/missing-pet-ad-list/missing-pet-ad-list.component';
import { HomeRoutingModule } from './home-routing.module';

const components = [
  MissingPetAdListComponent,
  MissingPetAdDetailsComponent
]

@NgModule({
  declarations: components,
  imports: [HomeRoutingModule, NativeScriptCommonModule, NativeScriptUIListViewModule, NativeScriptLocalizeModule, NativeScriptHttpClientModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
