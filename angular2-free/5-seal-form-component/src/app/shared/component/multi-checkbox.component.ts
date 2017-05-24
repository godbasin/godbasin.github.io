import {Component, Input, Output, EventEmitter} from '@angular/core';

class CheckConfig{
    id: string = '';
    text: string = '';
    isChecked: boolean = false;
}

@Component({
    selector: 'multi-checkbox',
    template: `
        <div class="checkbox" *ngFor="let option of options">
            <label>
                <input type="checkbox"  (change)="option.isChecked = $event.target.checked"
                       [checked]="option.isChecked">{{option.text}}
            </label>
        </div>
    `
})
export class MultiCheckboxComponent{
    @Input() options: CheckConfig[] = [];
    @Output() select = new EventEmitter();

}
