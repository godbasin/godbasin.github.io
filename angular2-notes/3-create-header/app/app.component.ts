import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';

// 添加Header组件，默认从header文件夹的index.ts中获取
import { Header } from './header';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  template: `
    <!--插入头部组件，注入指令后生效-->
    <my-header></my-header>
     <main>
      <router-outlet></router-outlet>
    </main>
  `,
  directives: [Header] // 注入指令
})
export class App {

  constructor(
    public appState: AppState) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
