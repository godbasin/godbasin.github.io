import {forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export function customInputAccessor(component){
    return {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => component),
        multi: true
    };
}

export class CustomInputComponent implements ControlValueAccessor {
    private model: any; // 控件的值
    private onChange: (_: any) => void;
    private onTouched: () => void;

    // get accessor
    get value(): any {
        return this.model;
    }

    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.model) {
            this.model = v;
            this.onChange(v);
        }
    }

    // Set touched on blur
    onBlur() {
        this.onTouched();
    }

    writeValue(value: string): void{
        if (value !== this.model) {
            this.model = value;
        }
    }

    // Set the function to be called when the control receives a change event.
    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    // registerOnTouched(fn: any) : void
    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }
}