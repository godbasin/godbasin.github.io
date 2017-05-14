import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: require('file-loader?name=[path][name].[ext]!./app.component.html')
})
export class AppComponent {
  title = 'app works!';
}
