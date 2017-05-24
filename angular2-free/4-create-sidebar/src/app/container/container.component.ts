import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ' <router-outlet></router-outlet>',
  styleUrls: [
    '../../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../../../node_modules/metismenu/dist/metisMenu.min.css',
    '../../assets/css/custom.css',
    '../../assets/css/common.css',
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(){
  }
}