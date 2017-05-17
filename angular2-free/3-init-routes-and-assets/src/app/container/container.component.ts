import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ' <router-outlet></router-outlet>',
  styleUrls: [
      '../../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../../assets/css/common.css',
    '../../assets/css/custom.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(){
  }
}