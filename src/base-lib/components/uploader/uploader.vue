<template>
  <el-upload
    ref="uploader"
    :action="uploadUrl"
    name="pic"
    :file-list="fileList"
    list-type="picture-card"
    :auto-upload="false"
    :on-success="onSuccess"
  >
    <i class="el-icon-plus" />
  </el-upload>
</template>

<script>

export default {
  name: 'Uploader',
  props: {
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    uploadUrl: {
      type: String,
      required: true
    },
    onSuccessCall: {
      type: Function,
      default() {}
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    submit() {
      this.$refs.uploader.submit()
    },
    onSuccess(res, file, fileList) {
      this.onSuccessCall(res, file, fileList)
    }
  }
}
</script>

<style scoped>

</style>
