import './less/index.less'; //less样式文件
import React from 'react'; //react
import ReactDOM from 'react-dom'; //react-dom
import Component from  './components/component.jsx'; //你的自定义组件
import $ from 'jquery'; //这里引入jquery

//将其渲染到页面上id为test的DOM元素内
ReactDOM.render(<Component></Component>, $('#test')[0]);

