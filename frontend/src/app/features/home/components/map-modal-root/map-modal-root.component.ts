import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Component, OnInit } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'fm-map-modal-root',
	templateUrl: './map-modal-root.component.html'
})
export class MapModalRootComponent implements OnInit {

	constructor(
    private routerExtensions: RouterExtensions,
    private activatedRoute: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.routerExtensions.navigate(['modal-view'], { relativeTo: this.activatedRoute });
	}

}
