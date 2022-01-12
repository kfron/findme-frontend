import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule, NativeScriptModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeModule } from './features/home/home.module';
import { MapModule } from './features/map/map.module';


const modules = [
	NativeScriptModule,
	AppRoutingModule,
	CoreModule,
	HomeModule,
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
