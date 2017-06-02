import {Component} from '@angular/core';
import {customForms, customFormsDefault} from './dynamic-form.config';

@Component({
    selector: 'page-setting',
    templateUrl: './main.component.html',
})
export class PageSettingComponent {
    title: string = 'page-setting';
    dateTime: string = '2017-05-25 18:55:00';
    imageArr = [
        'http://o905ne85q.bkt.clouddn.com/1484902936%281%29.png',
        'http://o905ne85q.bkt.clouddn.com/07J25Y0F~@O%5D@ZAGZ~%25%60%28%29Y.png',
    'http://o905ne85q.bkt.clouddn.com/3B8D%25PM%7DFA$%25B2G58~%25%28H%5B4.png'
    ];
    selection: any;
    selections: any[] = [{id: 123, text: 'abc'}, {id: 1223, text: 'abafc'}, {id: 12123, text: 'asdfabc'}];
    customForms = customForms;
    customFormsDefault = customFormsDefault;

    onChange(val: string){
        console.log(val);
        console.log(this.dateTime);
    }

    onSelect(val: any){
        console.log('PageSettingComponent onSelect: ', val);
    }
}