<template>
	<transition name="fade">
		<div>
			<a class="hiddenanchor" id="signup"></a>
			<a class="hiddenanchor" id="signin"></a>
			<div class="login_wrapper">
				<div class="animate form login_form">
					<section class="login_content">
						<form>
							<h1>管理系统</h1>
							<div>
								<input type="text" class="form-control" placeholder="用户名" v-model="username" required="" />
							</div>
							<div>
								<input type="password" class="form-control" placeholder="密码" v-model="password" required="" />
							</div>
							<div class="alert alert-danger alert-dismissible fade in" role="alert" v-show="error.shown">
								<strong>错误：</strong> {{error.text}}
							</div>
							<div>
								<a class="btn btn-default submit" href="javascript:;" v-on:click="login">登录</a>
							</div>

							<div class="clearfix"></div>
							<div>
								<h1><i class="fa fa-paw"></i> Gentelella Alela!</h1>
								<p>©2016 All Rights Reserved. Gentelella Alela! is a Bootstrap 3 template. Privacy and Terms</p>
							</div>
						</form>
					</section>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import userStore from "stores/userStore";
import { confirmDialog } from "tools/setDialog";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: {
        text: "",
        shown: false
      }
    };
  },
  methods: {
    // 登陆事件
    login() {
      const { username, password } = this;
      if (!username || !password) {
        this.error.text = "用户名和密码不能为空";
        this.error.shown = true;
        return;
      }
      confirmDialog(`确定登录？`).then(() => {
        userStore.dispatch("login", { username, password });
        this.$router.push({ name: "App" });
      });
    }
  },
  // 实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调
  created() {
    this.error.shown = false;
    $("body").attr("class", "login");
  },
  // 此时元素创建完成
  mounted() {
    $("input")[0].focus();
  }
};
</script>