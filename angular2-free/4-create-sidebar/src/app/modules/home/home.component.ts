import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home-root',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  ngOnInit(){
    $('body').attr('class', 'nav-md');
    $('.right_col').css('min-height', $(window).height());
  }
}