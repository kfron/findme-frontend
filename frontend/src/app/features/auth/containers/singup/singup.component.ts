import { User, Error } from './../../auth.model';
import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { TextField } from '@nativescript/core';
import { AuthService } from '../../auth.service';

@Component({
  moduleId: module.id,
  selector: 'fm-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit {

  email = "";
  password = "";
  confirmPassword = "";

  constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { }

  ngOnInit(): void { }

  signup(): void {
    if (this.email && this.password && this.confirmPassword && this.password === this.confirmPassword) {
      this.authService.signup({email: this.email, password: this.password, is_admin: false} as User)
        .subscribe((res) => {
          if ('error' in res) {
            alert({
              title: "Find Me",
              okButtonText: "OK",
              message: res.error
            });
            this.email = "";
            this.password = "";
            this.confirmPassword = "";
          } else {
            this.routerExtensions.navigate(['/home']);
          }
        })
    }

  }

  onReturnPress(args) {
    let textField = <TextField>args.object;

    setTimeout(() => {
      textField.dismissSoftInput();
    }, 100);

    this[textField.className] = textField.text;
  }

  toggleForm() {
    this.routerExtensions.navigate(['/auth'])
  }

}
