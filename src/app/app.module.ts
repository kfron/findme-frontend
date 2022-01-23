import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdsModule } from './features/ads/ads.module';
import { MapModule } from './features/map/map.module';


const modules = [
	NativeScriptModule,
	AppRoutingModule,
	AdsModule,
	MapModule,
	NativeScriptCommonModule,
	NativeScriptHttpClientModule,
	NativeScriptLocalizeModule
];

@NgModule({
	bootstrap: [AppComponent],
	imports: modules,
	declarations: [AppComponent],
	providers: [],
	schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule { }
