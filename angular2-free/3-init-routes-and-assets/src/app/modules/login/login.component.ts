import { Component, ViewEncapsulation, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/Rx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {
  }

  ngOnInit() {
    $('body').addClass('login');
  }

  // 登录事件
  onSubmit() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(){
    $('body').removeClass('login');
  }
}