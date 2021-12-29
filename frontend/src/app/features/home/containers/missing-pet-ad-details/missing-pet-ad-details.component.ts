import { AuthService } from './../../../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Subscription } from 'rxjs';
import { Ad } from '../../ads.model';
import { HomeService } from './../../home.service';

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-details',
  templateUrl: './missing-pet-ad-details.component.html',
  styleUrls: ['./missing-pet-ad-details.component.scss']
})
export class MissingPetAdDetailsComponent implements OnInit, OnDestroy {

  private subscription: Subscription
  owner = false

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private homeService: HomeService, private routerExtensions: RouterExtensions) { }

  ad: Ad = undefined

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id
    if (id) {
      this.subscription = this.homeService
      .getAdByid(id)
      .subscribe((ad: Ad[]) => {
        this.ad = ad[0];
        this.owner = this.authService.currentUser.id === this.ad.user_id;
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

  onEditTap(): void {
    this.routerExtensions.navigate(['/home/ad-edit', this.ad.id, this.ad.user_id, this.ad.name, this.ad.age, this.ad.image, this.ad.description], {
      animated: true,
      transition: {
        name: 'slide',
        duration: 200,
        curve: 'ease',
      }
    })
  }

}
