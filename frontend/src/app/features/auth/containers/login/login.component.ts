import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { TextField } from '@nativescript/core';
import { AuthService } from '../../auth.service';

@Component({
  moduleId: module.id,
  selector: 'fm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = "";
  password = "";

  constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { }

  ngOnInit(): void { }

  login(): void {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password)
        .subscribe((res) => {
          if ('error' in res) {
            alert({
              title: "Find Me",
              okButtonText: "OK",
              message: "We couldn't find your account."
            });
            this.email = "";
            this.password = "";
          } else {
            this.routerExtensions.navigate(['/home/']);
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

  forgotPassword() {

  }

  toggleForm() {
    this.routerExtensions.navigate(['/auth/signup'])
  }

}
