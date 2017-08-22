import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { InputComponent } from './components/input';

export function LoginComponent(sources) {
    const domSource = sources.DOM;

    // 登录点击和路由切换
    const loginClick$ = domSource.select('#submit').events('click');

    // 通过InputComponent注册的Input和值
    const pwdInputSource = new InputComponent(domSource, 'password');
    const pwdInputDOM$ = pwdInputSource.getDOM();
    const pwdInputValue$ = pwdInputSource.value;

    // 通过InputComponent注册的Input和值
    const unameInputSource = new InputComponent(domSource, 'text');
    const unameInputDOM$ = unameInputSource.getDOM();
    const unameInputValue$ = unameInputSource.value;

    // 设计一个定时器，每秒自增1，并输入到username的input
    let a = 1;
    setInterval(() => {
        unameInputSource.value = a++;
    }, 1000);

    // 合流生成最终DOM流
    const loginView$ = xs.combine(unameInputDOM$, unameInputValue$, pwdInputDOM$, pwdInputValue$).map(([unameDOM, unameValue, pwdDOM, pwdValue]) => {
        return (
            <form>
                <h1>System</h1>
                <div>
                    {unameDOM}
                </div>
                {unameValue}
                <div>
                    {pwdDOM}
                </div>
                {pwdValue}
                <div>
                    <a className="btn btn-default" id="submit">Login</a>
                </div>
            </form>
        )
    }
    );
    return {
        DOM: loginView$,
        router: loginClick$.mapTo("/app")
    };
}
