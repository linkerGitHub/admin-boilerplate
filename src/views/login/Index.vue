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
          v-model="form.name"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item
        prop="password"
      >
        <el-input
          v-model="form.password"
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
        name: '',
        password: ''
      },
      rule: {
        name: [
          { required: true, message: '请输入用户名' }
        ],
        password: [
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
            console.log(res)
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
