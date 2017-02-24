'use strict';

// 注入babel-polyfill
require('babel-polyfill');

// 注入angular相关配置，如路由等
import app from './app';

// 获取angular相关依赖
const angular = require('angular');
const ngRoute = require('angular-route');
const uiRouter = require('angular-ui-router');

// 注入控制器
import LoginCtrl from './modules/login/login.controller';
import AccountAddCtrl from './modules/home/account/accountAdd.controller';
import AccountCtrl from './modules/home/account/account.controller';

// 注入指令
import ComponentLoader from './shared/components';

// 注入服务
import AlertMsg from './shared/services/AlertMsg';
import HttpServices from './shared/services/HttpServices';
import AsyncForm from './shared/services/AsyncForm';

// 注入angular相关依赖
const dependencies = [
    ngRoute,
    uiRouter
];

// 获取angular的app
const ngModule = angular.module('AngularFree', dependencies);

[
    LoginCtrl,
    AccountAddCtrl,
    AccountCtrl,
    ComponentLoader,
    AlertMsg,
    HttpServices,
    AsyncForm
].forEach((service) => service(ngModule));

// 进行angular相关配置
app(ngModule, angular);

// 启动应用
angular.bootstrap(document, ['AngularFree']);