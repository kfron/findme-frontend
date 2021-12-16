import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { AuthService } from '../../auth.service';

@Component({
  moduleId: module.id,
  selector: 'fm-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit {

  constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { }

  ngOnInit(): void { }

  signup(): void {
    this.authService.signup("anon", "anon", "anon@anony.com","123123123", "dupa1", false)
        .subscribe((res) => {
          if(res.validated){
            this.routerExtensions.navigate(['/auth'])
          } else {
            this.routerExtensions.navigate(['/auth/signup'])
          }
        })
      
  }

}
