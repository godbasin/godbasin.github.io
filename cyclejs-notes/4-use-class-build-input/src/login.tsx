import xs from 'xstream';
import { InputComponent } from 'components/input';

export function LoginComponent(sources) {
    const domSource = sources.DOM;
    // 添加点击事件流
    const loginClick$ = domSource.select("#submit").events("click");

    // input stream for view
    const unameInputSource = new InputComponent(domSource, 'text');
    const unameInputDOM$ = unameInputSource.DOM;
    const unameInputValue$ = unameInputSource.value;

    const pwdInputSource = new InputComponent(domSource, 'password');
    const pwdInputDOM$ = pwdInputSource.DOM;
    const pwdInputValue$ = pwdInputSource.value;
    // 添加html流
    const loginView$ = xs.combine(unameInputDOM$, unameInputValue$, pwdInputDOM$, pwdInputValue$).map(([unameInput, unameValue, pwdInput, pwdValue]) =>
        {
            console.log({unameInput, unameValue, pwdInput, pwdValue});
            return (
                <form>
            <h1>System</h1>
            <div>{unameInput}</div>
            {unameValue}
            <div>{pwdInput}</div>
            {pwdValue}
            <div><button id="submit">Login</button></div>
        </form>
            )
        }
    );
    return {
        DOM: loginView$,
        router: xs.merge(
            // 点击事件将流转为'/app'
            loginClick$.mapTo("/app")
        ),
    };
}