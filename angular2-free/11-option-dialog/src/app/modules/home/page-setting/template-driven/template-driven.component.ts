import {Component} from '@angular/core';

@Component({
    selector: 'template-driven-form',
    templateUrl: './template-driven.component.html',
})
export class TemplateDrivenFormComponent {
    model: any = {};
    submit(){
        alert('成功！');
    }
}