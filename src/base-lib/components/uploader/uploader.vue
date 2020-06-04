<template>
  <div>
    <el-upload
      v-if="limit !== 1"
      ref="uploader"
      :action="uploadUrl"
      name="pic"
      :file-list="fileList"
      list-type="picture-card"
      :auto-upload="false"
      :on-success="onSuccess"
      :on-change="uploaderFileChangeHandle"
      :limit="limit"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-upload
      ref="uploader"
      :action="uploadUrl"
      name="pic"
      :show-file-list="false"
      :auto-upload="false"
      :on-success="onSuccess"
      :on-change="uploaderFileChangeHandle"
      :limit="limit"
    >
      <img
        v-if="files.length > 0"
        :src="files[0].url"
        class="avatar cov-preview"
        alt="preview"
      >
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"
      />
    </el-upload>
  </div>
</template>

<script>

export default {
  name: 'Uploader',
  props: {
    fileListOfUploader: {
      type: Array,
      default() {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    limit: {
      type: Number,
      default() {
        return Infinity
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
      files: this.fileList
    }
  },
  watch: {
    fileList: function (val, oldVal) {
      const ret = val.filter(item => {
        return oldVal.findIndex(it => {
          return it.url === item.url
        }) === -1
      })
      if(ret.length > 0) {
        this.files = val
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('update:fileListOfUploader', this.fileList)
    })
  },
  methods: {
    submit() {
      this.$refs.uploader.submit()
    },
    onSuccess(res, file, fileList) {
      this.onSuccessCall(res, file, fileList)
    },
    uploaderFileChangeHandle(file, fileList) {
      if(this.limit === 1) {
        if (file.status === 'ready') {
          const fileR = new FileReader()
          fileR.onload = (e) => {
            this.$set(file, 'url', e.target.result)
          }
          fileR.readAsDataURL(file.raw)
        }
        this.$emit('update:fileListOfUploader', [file])
        this.$emit('change', file, [file])
        this.files = [file]
      } else {
        this.$emit('update:fileListOfUploader', fileList)
        this.$emit('change', file, fileList)
        this.files = fileList
      }
    }
  }
}
</script>

<style scoped>
  .cov-preview{
    height: 120px;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 120px;
    line-height: 120px !important;
    text-align: center;
    border: 1px dashed #DCDFE6;
    border-radius: 4px;
  }
</style>
