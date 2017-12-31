import App from "../App";
import Services from "components/Services";
import ServiceAdd from "components/ServiceAdd";
import Products from "components/Products";
import Logs from "components/Logs";
import NoAuth from "components/NoAuth";
import NotFound from "components/NotFound";
import Login from "../Login";

export default [
  { path: "/login", component: Login, name: "Login" },
  {
    path: "/app",
    component: App,
    name: "App",
    redirect: "/app/services",
    // 设置子路由
    children: [
      {
        // 服务列表
        path: "services",
        component: Services,
        name: "Services",
        meta: {
          title: "服务列表",
          forbidRole: "visitor"
        }
      },
      {
        // 添加服务
        path: "add/service",
        component: ServiceAdd,
        name: "ServiceAdd",
        meta: {
          title: "添加服务",
          forbidRole: "visitor",
          accessRole: "owner"
        }
      },
      {
        // 修改服务
        path: "edit/service/:id",
        component: ServiceAdd,
        name: "ServiceEdit",
        meta: {
          title: "添加服务",
          forbidRole: "visitor",
          accessRole: ["owner", "maintainer"]
        }
      },
      {
        // 产品列表
        path: "products",
        component: Products,
        name: "Products",
        meta: {
          title: "产品列表"
        }
      },
      {
        // 日志列表
        path: "logs",
        component: Logs,
        name: "Logs",
        meta: {
          title: "日志列表"
        }
      },
      {
        // 无权限
        path: "noauth",
        component: NoAuth,
        name: "NoAuth",
        meta: {
          title: "无权限"
        }
      },
      {
        // 404
        path: "404",
        component: NotFound,
        name: "NotFound",
        meta: {
          title: "404"
        }
      }
    ]
  },
  { path: "*", redirect: { name: "NotFound" } }
];