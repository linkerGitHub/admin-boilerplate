<template>
  <div style="padding: 30px 0;">
    <el-form
      ref="userData"
      :model="userData"
      :rules="rules"
      size="medium"
      style="width: 400px"
      label-width="100px"
      class="demo-userData"
    >
      <el-form-item
        label="账户名"
        prop="admin_name"
      >
        <el-input v-model="userData.admin_name" />
      </el-form-item>

      <el-form-item
        label="原密码"
        prop="user_old_pass"
      >
        <el-input
          v-model="userData.user_old_pass"
          type="password"
        />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="admin_pass"
      >
        <el-input
          v-model="userData.admin_pass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="checkPass"
      >
        <el-input
          v-model="userData.checkPass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item class="form-option">
        <el-button
          type="primary"
          @click="submitForm('userData')"
        >
          提交
        </el-button>
        <el-button @click="resetForm('userData')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {modifyPass} from '@/api'

export default {
  name: 'Index',
  data() {
    const userName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
      }
      callback()

    }
    const prePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userData.checkPass !== '') {
          this.$refs.userData.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userData.admin_pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tabSelect: 'photos',
      userData: {
        id: this.$store.state.auth.uid,
        admin_pass: '',
        checkPass: '',
        admin_name: '',
        user_old_pass: ''
      },
      rules: {
        admin_name: [
          { required: true, validator: userName, trigger: 'blur' }
        ],
        user_old_pass: [
          { required: true, validator: prePass, trigger: 'change' }
        ],
        admin_pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          modifyPass(this.userData).then(res => {
            if(res.data.statusCode === 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
