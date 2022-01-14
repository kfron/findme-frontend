import { MyPingsViewComponent } from './components/my-pings-view/my-pings-view.component';
import { MyAdsViewComponent } from './components/my-ads-view/my-ads-view.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { UserGeneralViewComponent } from './components/user-general-view/user-general-view.component';


const routes: Routes = [
	{ path: '', component: UserGeneralViewComponent },
	{ path: 'edit', component: UserEditComponent },
	{ path: 'ads', component: MyAdsViewComponent },
	{ path: 'pings', component: MyPingsViewComponent }
];

@NgModule({
	imports: [NativeScriptRouterModule.forChild(routes)],
	exports: [NativeScriptRouterModule],
})
export class UserRoutingModule { }
