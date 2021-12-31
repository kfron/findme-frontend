import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { NavigatedData, ObservableArray, Page } from '@nativescript/core';
import { ListViewEventData } from 'nativescript-ui-listview';
import { Subscription } from 'rxjs';
import { Ad } from '../../ads.model';
import { HomeService } from './../../home.service';

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-list',
  templateUrl: './missing-pet-ad-list.component.html',
  styleUrls: ['./missing-pet-ad-list.component.scss']
})
export class MissingPetAdListComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []

  ads: ObservableArray<Ad> = new ObservableArray<Ad>([])

  constructor(
    private homeService: HomeService, 
    private routerExtensions: RouterExtensions,
    private page: Page) {
      this.page.on(Page.navigatedToEvent, (data: NavigatedData) => this.onNavigatedTo(data));
    }

  ngOnInit(): void {
    this.subscriptions.push(this.homeService
      .getAdsList()
      .subscribe((ads: Ad[]) => {
        this.ads = new ObservableArray(ads)
      }))
  }

  ngOnDestroy(): void {
    while (this.subscriptions.length != 0) {
      var sub = this.subscriptions.pop();
      sub.unsubscribe();
    }
  }

  onAdItemTap(args: ListViewEventData) {
    const tappedAdItem = (args.view.bindingContext as Ad)
    this.routerExtensions.navigate(['/home/ad-details', tappedAdItem.id], {
      animated: true,
      transition: {
        name: 'slide',
        duration: 200,
        curve: 'ease',
      }
    })
  }

  createNewAd() {
    this.routerExtensions.navigate(['/home/ad-create'])
  }

  onNavigatedTo(data: NavigatedData) {
    if (data.isBackNavigation) {
      this.subscriptions.push(this.homeService
        .getAdsList()
        .subscribe((ads: Ad[]) => {
          this.ads = new ObservableArray(ads)
        }))
    }
  }

  onMapButtonTap() {
    this.routerExtensions.navigateByUrl('/map')
  }

}
