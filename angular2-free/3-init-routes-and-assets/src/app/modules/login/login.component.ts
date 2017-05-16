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

  constructor() {
  }

  ngOnInit() {
    $('body').addClass('login');
  }

  // 登录事件
  onSubmit() {
    if (!this.username || !this.password) {
      alert('账户和密码不能为空');
      return;
    }
    // this.router.navigate(['/home']);
  }

  ngOnDestroy(){
    $('body').removeClass('login');
  }
}