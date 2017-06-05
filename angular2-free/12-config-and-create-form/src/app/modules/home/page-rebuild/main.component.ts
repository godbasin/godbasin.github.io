import {Component} from '@angular/core';
import {ICustomControl} from 'shared/component/dynamic-form/dynamic-form.component';

@Component({
    selector: 'page-rebuild',
    templateUrl: './main.component.html',
})
export class PageRebuildComponent {
    customControl: ICustomControl[];
    json: any;
    isShown: boolean = false;

    buildForm(){
        this.isShown = false;
        const config = JSON.parse(this.json);
        console.log(config)
        this.customControl = config.jsonResult;
        this.isShown = true;
    }
}