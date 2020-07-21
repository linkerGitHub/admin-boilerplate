<template>
  <div>
    <manage-table
      ref="manager"
      data-src-url="/sys-config"
      :extra-params="{ cfg_type: 'back_pic' }"
      :columns-definition="def"
      :data-shaper="dataShaper"
      :new-one-click-handle="newOneClickHandle"
      :edit-click-handle="editOneClickHandle"
    >
      <template v-slot:newOneForm="{ formData }">
        <el-form
          :model="formData"
          label-width="130px"
        >
          <el-form-item label="名称">
            <el-input v-model="formData.cfg_key" />
          </el-form-item>
          <el-form-item
            label="选择图像"
            prop="cfg_val"
          >
            <uploader
              ref="picUploadForNew"
              :upload-url="uploadUrl"
              :file-list-of-uploader.sync="uploaderFile.newOne"
              :limit="1"
              :extra-data="{ file_scope: 'public' }"
              :headers="{authorization: $store.state.auth.token}"
              :on-success-call="uploadSuccessHandleForNew"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:editForm="{ formData }">
        <el-form
          :model="formData"
          label-width="130px"
        >
          <el-form-item label="名称">
            <el-input v-model="formData.cfg_key" />
          </el-form-item>
          <el-form-item
            label="选择图像"
            prop="cfg_val"
          >
            <uploader
              ref="picUploadForEdit"
              :upload-url="uploadUrl"
              :file-list-of-uploader.sync="uploaderFile.edit"
              :limit="1"
              :extra-data="{ file_scope: 'public' }"
              :headers="{authorization: $store.state.auth.token}"
              :on-success-call="uploadSuccessHandleForEdit"
            />
          </el-form-item>
        </el-form>
      </template>
    </manage-table>
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable/ManageTable'
import {picAddr} from '@/constant'
import config from '@/base-lib/utils/axios/config'
import Uploader from '@/base-lib/components/uploader/uploader'
export default {
  name: 'Index',
  components: {Uploader, ManageTable},
  data() {
    return {
      uploaderFile: {
        newOne: [],
        edit: []
      },
      def: [
        {
          prop: 'cfg_key',
          label: '名称'
        },
        {
          prop: 'cfg_val',
          label: '图片',
          nodeExpress: function (h, val) {
            return h('el-image', {
              props: {
                src: config.baseURL + '/retrieve-file/' + val + '?preview=1&width=200&watermark=false&file_scope=public',
                lazy: true,
                fit: 'cover'
              },
              style: {
                'min-width': '200px'
              }
            })
          }
        }
      ],
      picAddr,
      uploadUrl: config.baseURL + '/upload-file',
      tmp: {
        newOneData: {},
        editData: {}
      }
    }
  },
  methods: {
    uploadSuccessHandleForNew: function (res) {
      this.tmp.newOneData.cfg_val = res.data._id.$oid
      this.$refs.manager.newOneFormConfirmHandle()
    },

    uploadSuccessHandleForEdit(res) {
      this.tmp.editData.cfg_val = res.data._id.$oid
      this.$refs.manager.editOneFormConfirmHandle()
    },
    dataShaper: function () {
      return {
        cfg_type: 'back_pic',
        cfg_key: ''
      }
    },
    newOneClickHandle(data) {
      this.tmp.newOneData = data
      if(-1 !== this.uploaderFile.newOne.findIndex(item => {
        return item.status === 'ready'
      })) {
        this.$refs.picUploadForNew.submit()
      } else {
        this.$refs.manager.newOneFormConfirmHandle()
      }
    },
    editOneClickHandle(data) {
      this.tmp.editData = data
      if(-1 !== this.uploaderFile.edit.findIndex(item => {
        return item.status === 'ready'
      })) {
        this.$refs.picUploadForEdit.submit()
      } else {
        this.$refs.manager.editOneFormConfirmHandle()
      }
    },
  }
}
</script>

<style scoped>

</style>
