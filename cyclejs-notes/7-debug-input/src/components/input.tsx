import xs from 'xstream';
import { run } from '@cycle/run';
import { mockDOMSource } from '@cycle/dom';
import { bindMethods } from 'utils/bindMethods';
import {adapt} from '@cycle/run/lib/adapt';

let id = 0;

@bindMethods
export class InputComponent {
  id;
  DOM;
  inputGet;
  inputSet;
  constructor(domSource, type) {
    this.id = id++;
    // 给设置值预留，初始化流为undefined
    this.inputSet = xs.of(undefined);

    // 接上设置流
    this.DOM = xs.merge(this.inputSet).map(val =>
      <input type={type} id={'input' + this.id} className="form-control" value={val} />
    );

    // 获取对应的值
    this.inputGet = domSource.select('#input' + this.id).events('keyup')
      .map(ev => ev.target.value).startWith('');
  }
  getDOM() {
    return this.DOM;
  }
  getValue() {
    return this.inputGet;
  }
  setValue(val) {
    // 待实现
  }
}