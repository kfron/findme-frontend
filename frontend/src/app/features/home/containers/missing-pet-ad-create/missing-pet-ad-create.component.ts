import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fm-missing-pet-ad-create',
  templateUrl: './missing-pet-ad-create.component.html',
  styleUrls: ['./missing-pet-ad-create.component.scss']
})
export class MissingPetAdCreateComponent implements OnInit {
  user = this.authService.currentUser

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    
  }

}
