import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { bindMethods } from 'utils/bindMethods';

// 为了匹配不一样的input，只能先凑合加个随机id来匹配啦
let id: number = 0;

@bindMethods
export class InputComponent {
  DOM: any;
  value: any;
  constructor(domSources, type) {
    // 获取值的流呀
    const value = domSources.select('#input' + id).events('change')
      .map(ev => ev.target.value).startWith('');
    this.value = value;
    // DOM值
    this.DOM = value.map(val => {
      return <input type={type} id={'input' + id++} className="form-control" value={val} />;
    });
  }
}
