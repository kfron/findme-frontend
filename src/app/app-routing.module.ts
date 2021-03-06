import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

const routes: Routes = [
	{ path: '', redirectTo: '/auth', pathMatch: 'full' },
	{
		path: 'home',
		loadChildren: () => import('~/app/features/ads/ads.module').then((m) => m.AdsModule)
	},
	{
		path: 'auth',
		loadChildren: () => import('~/app/features/auth/auth.module').then((m) => m.AuthModule)
	},
	{
		path: 'map',
		loadChildren: () => import('~/app/features/map/map.module').then((m) => m.MapModule)
	},
	{
		path: 'user',
		loadChildren: () => import('~/app/features/user/user.module').then((m) => m.UserModule)
	}
];

@NgModule({
	imports: [NativeScriptRouterModule.forRoot(routes)],
	exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
