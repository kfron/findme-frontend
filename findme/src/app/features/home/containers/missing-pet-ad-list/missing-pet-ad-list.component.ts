import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fm-missing-pet-ad-list',
  templateUrl: './missing-pet-ad-list.component.html',
  styleUrls: ['./missing-pet-ad-list.component.scss']
})
export class MissingPetAdListComponent implements OnInit {

  ads = [
    {
      name: "Kevin",
      age: 12,
      ID: 1234,
      pic: "https://via.placeholder.com/300"
    },
    {
      name: "Max",
      age: 4,
      ID: 1232,
      pic: "https://via.placeholder.com/300"
    },
    {
      name: "Mufinka",
      age: 1,
      ID: 3233,
      pic: "https://via.placeholder.com/300"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
