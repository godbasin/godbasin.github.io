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
import AlertDirective from './shared/components/alertMsg.directive';
import BeDisableIDirective from './shared/components/beDisableIf.directive';
import SafeClickDirective from './shared/components/safeClick.directive';
import SelectDateDirective from './shared/components/selectDate.directive';
import SelectDateIntervalDirective from './shared/components/selectDateInterval.directive';
import SelectTimeDirective from './shared/components/selectTime.directive';
import SidebarDirective from './shared/components/sidebar.directive';
import OnEnterDirective from './shared/components/onEnter.directive';
import OnEscDirective from './shared/components/onEsc.directive';
import OnFocusLostDirective from './shared/components/onFocusLost.directive';

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
    AlertDirective,
    BeDisableIDirective,
    SafeClickDirective,
    SelectDateDirective,
    SelectDateIntervalDirective,
    SelectTimeDirective,
    SidebarDirective,
    OnEnterDirective,
    OnEscDirective,
    OnFocusLostDirective,
    AlertMsg,
    HttpServices,
    AsyncForm
].forEach((service) => service(ngModule));

// 进行angular相关配置
app(ngModule, angular);

// 启动应用
angular.bootstrap(document, ['AngularFree']);