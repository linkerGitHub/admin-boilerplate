<template>
  <div class="login-box">
    <h3 style="text-align: center;">
      登录系统
    </h3>
    <el-form
      ref="form"
      :model="form"
      :rules="rule"
    >
      <el-form-item
        prop="name"
      >
        <el-input
          v-model="form.admin_name"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item
        prop="password"
      >
        <el-input
          v-model="form.admin_pass"
          type="password"
          placeholder="密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          style="width: 100%"
          type="primary"
          @click="submit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login} from '@/api'

export default {
  name: 'Index',
  data() {
    return {
      form: {
        admin_name: '',
        admin_pass: ''
      },
      rule: {
        admin_name: [
          { required: true, message: '请输入用户名' }
        ],
        admin_pass: [
          { required: true, message: '请输入密码' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if(valid) {
          login(this.form).then(res => {
            const auth = JSON.stringify(res.data.data.data)
            localStorage.setItem('auth', auth)
            this.$store.commit('setAuth', res.data.data.data)
            this.$router.push({name : 'index'})
          })
        }
      })
    }
  }
}
</script>

<style scoped>
    .login-box{
        width: 300px;
        margin: 35vh auto auto;
    }
</style>
