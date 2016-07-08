<template>
 <div class="container" id="login">
	<form id="login-form">
		<h3 class="text-center">login</h3>
		<div class="form-group">
			<label>account</label>
			<!--v-model双向绑定账号-->
			<input type="text" class="form-control" placeholder="Account" v-model="username" required />
		</div>
		<div class="form-group">
			<label>Password</label>
			<!--v-model双向绑定密码-->
			<input type="password" class="form-control" placeholder="Password" v-model="password" required>
		</div>
		<button class="btn btn-default" v-on:click="submit">登录</button>
	</form>
</div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  // 在 `methods` 对象中定义方法
  methods: {
    submit: function () {
      console.log('username: ' + this.username)
      this.$route.router.go({name: 'index'})
    }
  }
}
</script>

<style scoped>
#login {
  padding: 200px 20px;
  width: 730px;
}
	
#login > form {
  border: solid 1px #999;
  padding: 20px;
  border-radius: 5px;
}
</style>
