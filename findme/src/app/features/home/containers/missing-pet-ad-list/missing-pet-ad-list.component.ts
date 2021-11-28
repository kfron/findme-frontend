import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { ObservableArray } from '@nativescript/core';
import { ListViewEventData } from 'nativescript-ui-listview';
import { Subscription } from 'rxjs';
import { HomeService } from './../../home.service';

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-list',
  templateUrl: './missing-pet-ad-list.component.html',
  styleUrls: ['./missing-pet-ad-list.component.scss']
})
export class MissingPetAdListComponent implements OnInit, OnDestroy {

  private subscription: Subscription

  ads: ObservableArray<any> = new ObservableArray<any>([])

  constructor(private homeService: HomeService, private routerExtensions: RouterExtensions) { }

  ngOnInit(): void {
    this.subscription = this.homeService
      .getAdsList()
      .subscribe((ads: Array<any>) => {
        this.ads = new ObservableArray(ads)
      })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
  }

  onAdItemTap(args: ListViewEventData) {
    const tappedAdItem = args.view.bindingContext
    this.routerExtensions.navigate(['/home/ad-details', tappedAdItem.ID], {
      animated: true,
      transition: {
        name: 'slide',
        duration: 200,
        curve: 'ease',
      }
    })
  }

}
