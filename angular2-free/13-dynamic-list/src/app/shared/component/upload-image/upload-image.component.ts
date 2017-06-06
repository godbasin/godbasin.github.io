import {Component, Input, OnInit, ElementRef} from '@angular/core';
import {customInputAccessor} from '../../class/custom-input.class';

export interface ILimit {
    width?: number;
    height?: number;
    size?: number;
    type?: string;
}

@Component({
    selector: 'upload-image',
    templateUrl: './upload-image.component.html',
    providers: [customInputAccessor(UploadImageComponent)]
})
export class UploadImageComponent implements OnInit {
    @Input() disabled: boolean = false;
    @Input() required: boolean = false;
    @Input() limit: ILimit = {};
    @Input() btnName: string = '上传图片';

    imagesArr: any = [];
    help: string = '';
    checkErrArr: any = [];

    private model: string[] = []; // 选中url的组合
    private onChange: (_: any) => void;
    private onTouched: () => void;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        if (this.required) {
            this.help += '必填；';
        }
        if (this.limit) {
            if (this.limit.width && this.limit.height) {
                this.help += '图片尺寸：' + this.limit.width + '*' + this.limit.height + '以内';
            }
            if (this.limit.size) {
                this.help = this.help ? this.help + ',' + this.limit.size + 'k以内' : this.limit.size + 'k以内';
            }
            if (this.limit.type) {
                this.help = this.help ? this.help + ',图片类型:' + this.limit.type : ',图片类型:' + this.limit.type;
            }
        }
    }

    upLoad() {
        this.imagesArr = [];
        this.model = [];
        this.checkErrArr = [];
        const input = $(this.el.nativeElement).find('input')[0];
        const files = input.files;
        if (files) {
            Object.keys(files).forEach(index => {
                const file = files[index];
                const regMap = {
                    jpg: /\.(jpe?g)$/i,
                    jpeg: /\.(jpe?g)$/i,
                    png: /\.(png)$/i,
                    gif: /\.(gif)$/i
                };
                const reader: FileReader = new FileReader();

                reader.onload = (e: ProgressEvent) => {
                    const image = new Image();
                    const url = reader.result;
                    const name = file.name;
                    const checkErr = [];
                    image.onload = ev => {
                        if (this.limit.size && file.size > this.limit.size * 1024) {
                            checkErr.push('图片大小已超过 ' + this.limit.size + ' K限制');
                        }
                        if ((this.limit.width && image.width > this.limit.width) ||
                            (this.limit.height && image.height > this.limit.height)) {
                            checkErr.push('图片尺寸不满足 ' + (this.limit.width ? 'w: ' + this.limit.width + ' 以内' : '') +
                                (this.limit.height ? ' h: ' + this.limit.height + ' 以内' : ''));
                        }
                        if (this.limit.type && regMap[this.limit.type] && !regMap[this.limit.type].test(file.name)) {
                            checkErr.push('图片类型不符合要求，需要上传' + this.limit.type);
                        }
                        if (!checkErr.length) {
                            this.imagesArr.push({name, url});
                            this.model.push(url);
                            this.onChange(this.model);
                        } else {
                            this.checkErrArr.push({name, checkErr});
                        }
                    };
                    image.src = url;
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // Set touched on blur
    onBlur() {
        this.onTouched();
    }

    writeValue(value: string[]): void {
        if (value && value.length) {
            this.model = value;
            this.imagesArr = this.model.map(url => {
                return {url, name: ''};
            });
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
