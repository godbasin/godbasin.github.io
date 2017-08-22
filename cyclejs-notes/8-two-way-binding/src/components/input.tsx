import xs from 'xstream';
import { run } from '@cycle/run';
import { mockDOMSource } from '@cycle/dom';
import { bindMethods } from 'utils/bindMethods';
import {adapt} from '@cycle/run/lib/adapt';

let id = 0;

@bindMethods
export class InputComponent {
  id;
  listener;
  DOM;
  inputGet;
  inputSet;
  constructor(domSource, type) {
    this.id = id++;

    // 初始化流，并提取出监听器
    this.inputSet = xs.create({
      start: listener => {
        this.listener = listener;
      },
      stop: () => {},
    }).startWith(undefined);

    // 接上设置流
    this.DOM = xs.merge(this.inputSet).map(val =>
      <input type={type} id={'input' + this.id} className="form-control" value={val} />
    );

    // 合并输入流和源流，然后输出更新值
    this.inputGet = xs.merge(domSource.select('#input' + this.id).events('keyup')
    .map(ev => ev.target.value), this.inputSet).startWith('');
  }
  getDOM() {
    return this.DOM;
  }
  get value() {
    return this.inputGet;
  }
  set value(val) {
    // 触发监听器
    this.listener.next(val);
  }
}