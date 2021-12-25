import { Ad } from './../../ads.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { RadDataFormComponent } from 'nativescript-ui-dataform/angular';

const metadata = require('./adMetadata.json');

@Component({
  moduleId: module.id,
  selector: 'fm-missing-pet-ad-create',
  templateUrl: './missing-pet-ad-create.component.html',
  styleUrls: ['./missing-pet-ad-create.component.scss']
})
export class MissingPetAdCreateComponent implements OnInit {
  adMetadata = JSON.parse(JSON.stringify(metadata));
  user = this.authService.currentUser;
  ad: Ad;

  constructor(private authService: AuthService) { }

  @ViewChild('adCreateDataForm', { static: false }) adCreateDataForm: RadDataFormComponent;

  ngOnInit(): void {
    this.ad = { name: '', age: null, image: '', description: '' } as Ad;
  }

  async test() {
    console.log("Before validation and commit");
    console.log(this.ad);
    let isValid = await this.adCreateDataForm.dataForm.validateAndCommitAll();
    if (isValid) {
      console.log("Valid!");
      console.log(this.ad);
    } else {
      console.log("Not valid");
      console.log(this.ad);
    }
  }

  commitTest() {
    console.log("Commited!");
  }
}
