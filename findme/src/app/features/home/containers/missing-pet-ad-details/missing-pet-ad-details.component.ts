import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { HomeService } from './../../home.service';

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-details',
  templateUrl: './missing-pet-ad-details.component.html',
  styleUrls: ['./missing-pet-ad-details.component.scss']
})
export class MissingPetAdDetailsComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private homeService: HomeService, private routerExtensions: RouterExtensions) { }

  ad = undefined

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id
    if (id) {
      this.ad = this.homeService.getAdByID(id) 
    }
  }

  onBackButtonTap(): void {
    this.routerExtensions.backToPreviousPage()
  }

}
