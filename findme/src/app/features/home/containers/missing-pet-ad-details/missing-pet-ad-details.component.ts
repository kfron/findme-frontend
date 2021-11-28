import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Subscription } from 'rxjs';
import { Ad } from '../../ads.model';
import { AdResponse } from './../../ads.model';
import { HomeService } from './../../home.service';

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-details',
  templateUrl: './missing-pet-ad-details.component.html',
  styleUrls: ['./missing-pet-ad-details.component.scss']
})
export class MissingPetAdDetailsComponent implements OnInit, OnDestroy {

  private subscription: Subscription

  constructor(private activatedRoute: ActivatedRoute, private homeService: HomeService, private routerExtensions: RouterExtensions) { }

  ad: Ad = undefined

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id
    if (id) {
      this.subscription = this.homeService
      .getAdByid(id)
      .subscribe((ad: AdResponse) => {
        this.ad = ad.data[0]
      })
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
  }

  onBackButtonTap(): void {
    this.routerExtensions.backToPreviousPage()
  }

}
