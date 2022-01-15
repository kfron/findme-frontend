import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from './../../../../shared/services/map.service';

@Component({
	moduleId: module.id,
	selector: 'fm-map-modal-root',
	templateUrl: './map-modal-root.component.html'
})
export class MapModalRootComponent implements OnInit {

	constructor(
		private mapService: MapService,
		private activatedRoute: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.mapService.navigateTo(['modal-view'], { relativeTo: this.activatedRoute });
	}

}
