import { AuthService } from './../../../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from '@nativescript/angular';
import { Subscription } from 'rxjs';
import { Ad } from '../../ads.model';
import { HomeService } from './../../home.service';
import { NavigatedData, Page } from '@nativescript/core';

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-details',
  templateUrl: './missing-pet-ad-details.component.html',
  styleUrls: ['./missing-pet-ad-details.component.scss']
})
export class MissingPetAdDetailsComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []
  owner = false;
  isBusy = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private routerExtensions: RouterExtensions,
    private page: Page) {
    this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
  }

  ad: Ad = undefined

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params.id
    if (id) {
      this.isBusy = true;
      this.subscriptions.push(this.homeService
        .getAdByid(id)
        .subscribe((ad: Ad[]) => {
          this.ad = ad[0];
          this.owner = this.authService.currentUser.id === this.ad.user_id;
          this.isBusy = false;
        }));
    }
  }

  ngOnDestroy(): void {
    while (this.subscriptions.length != 0) {
      var sub = this.subscriptions.pop();
      sub.unsubscribe();
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

  onPingTap(): void {
    this.routerExtensions.navigate(['/map/ping', this.ad.id], {
      animated: true,
      transition: {
        name: 'slide',
        duration: 200,
        curve: 'ease',
      }
    })
  }

  onNavigatedTo(data: NavigatedData) {
    if (data.isBackNavigation) {
      this.isBusy = true;
      this.subscriptions.push(this.homeService
        .getAdByid(this.ad.id)
        .subscribe((ad: Ad[]) => {
          this.ad = ad[0];
          this.owner = this.authService.currentUser.id === this.ad.user_id;
          this.isBusy = false;
        }));
    }
  }

}
