import { html } from 'snabbdom-jsx';
import xs from 'xstream';

export function LoginComponent(sources) {
    const domSource = sources.DOM;
    // 添加点击事件流
    const loginClick$ = domSource.select("#submit").events("click");

    // 添加html流
    const loginView$ = xs.merge().startWith(
        <form>
            <h1>System</h1>
            <div><input type="text" placeholder="username" /></div>
            <div><input type="password" placeholder="password" /></div>
            <div><button id="submit">Login</button></div>
        </form>
    );
    return {
        DOM: loginView$,
        router: xs.merge(
            // 点击事件将流转为'/app'
            loginClick$.mapTo("/app")
        ),
    };
}