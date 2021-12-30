import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { TextField } from '@nativescript/core';
import { AuthService } from '../../auth.service';

@Component({
  moduleId: module.id,
  selector: 'fm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  email = "";
  password = "";

  constructor(private authService: AuthService, private routerExtensions: RouterExtensions) { }

  ngOnInit(): void {
    console.log("Init login");
    this.email = "test";
    this.password = "test";
    this.login();
  }

  ngOnDestroy(): void {
    console.log("Destroyed login");
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
  }

  login(): void {
    if (this.email && this.password) {
      this.subscription = this.authService.login(this.email, this.password)
        .subscribe({
          next: (res) => {
            this.authService.currentUser = res;
            this.routerExtensions.navigate(['/home/']);
          },
          error: (err) => {
            console.log(err.error.message)
            alert({
              title: "Find Me",
              okButtonText: "OK",
              message: err.error.message
            });
            if (err.error.message !== 'Incorrect password.') {
              this.email = "";
            }
            this.password = "";
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
