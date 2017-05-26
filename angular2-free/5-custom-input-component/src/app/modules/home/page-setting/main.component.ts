import {Component} from '@angular/core';

@Component({
    selector: 'page-setting',
    templateUrl: './main.component.html',
})
export class PageSettingComponent {
    title: string = 'page-setting';
    dateTime: string = '2017-05-25 18:55:00';
    selection: any;
    selections: any[] = [{id: 123, text: 'abc'}, {id: 1223, text: 'abafc'}, {id: 12123, text: 'asdfabc'}];

    onChange(val: string){
        console.log(val);
        console.log(this.dateTime)
    }

    onSelect(val: any){
        console.log('PageSettingComponent onSelect: ', val);
    }
}