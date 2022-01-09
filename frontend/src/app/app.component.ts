import { Component, OnInit } from '@angular/core'
import { enableLocationRequest, isEnabled } from '@nativescript/geolocation'

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  async ngOnInit() {
    let enabled = await isEnabled()
    if (!enabled) {
      enableLocationRequest(true, true)
        .then(
          () => { },
          (r) => {
            console.log("Error: " + (r.message || r))
          })
        .catch(ex => {
          console.log("Unable to Enable Location", ex);
        })
    }
  }
}
