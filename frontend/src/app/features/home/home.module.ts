import { PipesModule } from './../../shared/pipes/pipes.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { MissingPetAdCreateComponent } from './containers/missing-pet-ad-create/missing-pet-ad-create.component';
import { MissingPetAdDetailsComponent } from './containers/missing-pet-ad-details/missing-pet-ad-details.component';
import { MissingPetAdEditComponent } from './containers/missing-pet-ad-edit/missing-pet-ad-edit.component';
import { MissingPetAdListComponent } from './containers/missing-pet-ad-list/missing-pet-ad-list.component';
import { HomeRoutingModule } from './home-routing.module';

const components = [
  MissingPetAdListComponent,
  MissingPetAdDetailsComponent,
  MissingPetAdCreateComponent,
  MissingPetAdEditComponent
]

const modules = [
  HomeRoutingModule,
  NativeScriptCommonModule,
  NativeScriptUIListViewModule,
  NativeScriptLocalizeModule,
  NativeScriptHttpClientModule,
  NativeScriptUIDataFormModule,
  PipesModule
]

@NgModule({
  declarations: components,
  imports: modules,
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule { }
