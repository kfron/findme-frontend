import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { NativeScriptLocalizeModule } from '@nativescript/localize/angular';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SingupComponent } from './components/singup/singup.component';

const components = [
	LoginComponent,
	SingupComponent
];

@NgModule({
	declarations: components,
	imports: [AuthRoutingModule, NativeScriptCommonModule, NativeScriptLocalizeModule, NativeScriptHttpClientModule],
	schemas: [NO_ERRORS_SCHEMA]
})
export class AuthModule { }
