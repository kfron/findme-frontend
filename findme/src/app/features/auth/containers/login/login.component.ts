import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { AuthService } from '../../auth.service';

@Component({
  moduleId: module.id,
  selector: 'fm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { }

  ngOnInit(): void { }

  login(): void {
    this.authService.login("anon@anony.com", "dupa1")
        .subscribe((res) => {
          if(res.validated){
            this.routerExtensions.navigate(['/home/'])
          } else {
            this.routerExtensions.navigate(['/auth/signup'])
          }
        })
  }

}
