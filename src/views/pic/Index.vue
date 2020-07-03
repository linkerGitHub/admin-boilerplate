<template>
  <div>
    <manage-table
      ref="manager"
      :columns-definition="def"
      :data-src-url="'/pic'"
      :data-shaper="dataShaper"
      :edit-deal="editDeal"
      :new-one-deal="editDeal"
      :new-one-click-handle="newOneClickHandle"
      :before-edit-dialog-open="beforeEditOpenHandle"
      :edit-click-handle="editOneClickHandle"
      :axios-requester="$genAxiosInstanceFn()"
    >
      <template v-slot:newOneForm="{ formData }">
        <el-form
          :model="formData"
          label-width="130px"
        >
          <el-form-item
            label="选择图像"
            prop=""
          >
            <uploader
              ref="picUploadForNew"
              :upload-url="uploadUrl"
              :file-list-of-uploader.sync="uploaderFile.newOne"
              :limit="1"
              :headers="{authorization: $store.state.auth.token}"
              :on-success-call="uploadSuccessHandleForNew"
              @change="uploaderFileChangeHandle(formData, ...arguments)"
            />
          </el-form-item>
          <el-form-item
            label="图像编号"
            prop="pic_no_code"
          >
            <el-input v-model="formData.pic_no_code" />
          </el-form-item>
          <el-form-item
            label="标签"
            prop="tag"
          >
            <select-with-remote-search
              v-model="formData.tag"
              :axios-requester="$genAxiosInstanceFn()"
              data-src-url="/tag"
              label-key="tag_name"
            />
          </el-form-item>
          <el-form-item
            label="图集"
            prop="collection"
          >
            <select-with-remote-search
              v-model="formData.collection"
              :axios-requester="$genAxiosInstanceFn()"
              data-src-url="/collection"
              label-key="collection_name"
            />
          </el-form-item>
          <el-form-item
            label="所属时间阶段"
            prop="time_stage"
          >
            <el-select
              v-model="formData.time_stage"
              value-key="id"
              multiple
            >
              <el-option
                v-for="op in $store.state.dataSrc.timeStage"
                :key="op.id"
                :label="op.stage_name"
                :value="op"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="所属街道"
            prop="street"
          >
            <el-select
              v-model="formData.street"
              value-key="id"
              multiple
            >
              <el-option
                v-for="op in $store.state.dataSrc.street"
                :key="op.id"
                :label="op.street_name"
                :value="op"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="所属地点"
            prop="place"
          >
            <el-select
              v-model="formData.place"
              value-key="id"
              multiple
            >
              <el-option
                v-for="op in $store.state.dataSrc.place"
                :key="op.id"
                :label="op.place_name"
                :value="op"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="地理坐标"
            prop="lat_lng"
          >
            <get-position-from-map
              v-model="formData.lat_lng"
              style="width: 100%; height: 400px;"
            />
          </el-form-item>
          <el-form-item
            label="图像描述"
            prop="pic_description"
          >
            <el-input
              v-model="formData.pic_description"
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="图像尺寸"
            prop="pic_size"
          >
            <el-input v-model="formData.pic_size" />
          </el-form-item>
          <el-form-item
            label="拍摄（制作）时间"
            prop="pic_shot_time"
          >
            <el-date-picker
              v-model="formData.pic_shot_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item
            label="版权说明"
            prop="copyright_description"
          >
            <el-input
              v-model="formData.copyright_description"
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="肖像权/物权"
            prop="pic_thing_right"
          >
            <el-input
              v-model="formData.pic_thing_right"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:editForm="{ formData }">
        <el-form
          :model="formData"
          label-width="130px"
        >
          <el-form-item
            label="选择图像"
            prop="pic_key"
          >
            <uploader
              ref="picUploadForEdit"
              :upload-url="uploadUrl"
              :file-list-of-uploader.sync="uploaderFile.newOne"
              :file-list="[{url: picAddr + formData.pic_key + '?preview=1&scale=10'}]"
              :limit="1"
              :headers="{authorization: $store.state.auth.token}"
              :on-success-call="uploadSuccessHandleForNew"
              @change="uploaderFileChangeHandle(formData, ...arguments)"
            />
          </el-form-item>
          <el-form-item
            label="图像编号"
            prop="pic_no_code"
          >
            <el-input v-model="formData.pic_no_code" />
          </el-form-item>
          <el-form-item
            label="标签"
            prop="tag"
          >
            <select-with-remote-search
              v-model="formData.tag"
              :axios-requester="$genAxiosInstanceFn()"
              data-src-url="/tag"
              label-key="tag_name"
            />
          </el-form-item>
          <el-form-item
            label="图集"
            prop="collection"
          >
            <select-with-remote-search
              v-model="formData.collection"
              :axios-requester="$genAxiosInstanceFn()"
              data-src-url="/collection"
              label-key="collection_name"
            />
          </el-form-item>
          <el-form-item
            label="所属时间阶段"
            prop="time_stage"
          >
            <el-select
              v-model="formData.time_stage"
              value-key="id"
              multiple
            >
              <el-option
                v-for="op in $store.state.dataSrc.timeStage"
                :key="op.id"
                :label="op.stage_name"
                :value="op"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="所属街道"
            prop="street"
          >
            <el-select
              v-model="formData.street"
              value-key="id"
              multiple
            >
              <el-option
                v-for="op in $store.state.dataSrc.street"
                :key="op.id"
                :label="op.street_name"
                :value="op"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="所属地点"
            prop="place"
          >
            <el-select
              v-model="formData.place"
              value-key="id"
              multiple
            >
              <el-option
                v-for="op in $store.state.dataSrc.place"
                :key="op.id"
                :label="op.place_name"
                :value="op"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="地理坐标"
            prop="lat_lng"
          >
            <get-position-from-map
              v-model="formData.lat_lng"
              style="width: 100%; height: 400px;"
            />
          </el-form-item>
          <el-form-item
            label="图像描述"
            prop="pic_description"
          >
            <el-input
              v-model="formData.pic_description"
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="图像尺寸"
            prop="pic_size"
          >
            <el-input v-model="formData.pic_size" />
          </el-form-item>
          <el-form-item
            label="拍摄（制作）时间"
            prop="pic_shot_time"
          >
            <el-date-picker
              v-model="formData.pic_shot_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item
            label="版权说明"
            prop="copyright_description"
          >
            <el-input
              v-model="formData.copyright_description"
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            label="肖像权/物权"
            prop="pic_thing_right"
          >
            <el-input
              v-model="formData.pic_thing_right"
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </template>
    </manage-table>
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable/Index.vue'
import config from '@/base-lib/utils/axios/config'
import Uploader from '@/base-lib/components/uploader/uploader'
import EXIF from 'exif-js'
import GetPositionFromMap from '@/base-lib/components/GeoMap/GetPositionFromMap'
import SelectWithRemoteSearch from '@/base-lib/components/selectWithRemoteSearch/selectWithRemoteSearch'
import {picAddr} from '@/constant'
import {getPicById} from '@/api'
import dayjs from 'dayjs'

window.dayjs = dayjs
export default {
  name: 'Index',
  components: {SelectWithRemoteSearch, GetPositionFromMap, Uploader, ManageTable},
  data() {
    return {
      picAddr,
      uploadUrl: config.baseURL + '/upload-file',
      def: [
        {
          prop: 'pic_key',
          label: '图片',
          //<el-image v-for="url in urls" :key="url" :src="url" lazy></el-image>
          nodeExpress: function (h, val) {
            return h('el-image', {
              props: {
                src: config.baseURL + '/retrieve-file/' + val + '?preview=1&scale=10',
                lazy: true,
                fit: 'cover'
              }
            })
          }
        },
        {
          prop: 'pic_size',
          label: '图片尺寸'
        },
        {
          prop: 'pic_shot_time',
          label: '拍摄时间'
        },
        {
          prop: 'pic_description',
          label: '图片描述'
        },
        {
          prop: 'copyright_description',
          label: '版权说明'
        }
      ],
      uploaderFile: {
        newOne: [],
        edit: []
      },
      tmp: {
        newOneData: {},
        editData: {}
      }
    }
  },
  methods: {
    beforeEditOpenHandle(data) {
      const loading = this.$loading()
      return new Promise((resolve) => {
        getPicById(data.id).then(res => {
          resolve(res.data.data.rows[0])
        }).finally(() => {
          loading.close()
        })
      })
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
    uploadSuccessHandleForNew(res) {
      this.tmp.newOneData.pic_key = res.data._id.$oid
      this.$refs.manager.newOneFormConfirmHandle()
    },
    dataShaper() {
      return {
        copyright_description: '',
        pic_thing_right: '',
        item_status: 1,
        lat_lng: [],
        pic_description: '',
        pic_key: '',
        pic_no_code: '',
        pic_shot_time: '',
        pic_size: '',
        place: [],
        street: [],
        time_stage: []
      }
    },
    editDeal(data) {
      const tmp = data
      console.log(tmp)
      if(tmp.lat_lng.constructor === Array) {
        tmp.lat_lng = JSON.stringify(tmp.lat_lng)
      }
      tmp.place = tmp.place.map(item => {
        return item.id
      })
      tmp.street = tmp.street.map(item => {
        return item.id
      })
      tmp.collection = tmp.collection.map(item => {
        return item.id
      })
      tmp.tag = tmp.tag.map(item => {
        return item.id
      })
      tmp.time_stage = tmp.time_stage.map(item => {
        return item.id
      })
      console.log(tmp)
      return new Promise(resolve => {
        resolve(tmp)
      })
    },
    uploaderFileChangeHandle(fd, file) {
      fd.pic_description = file.name.split('.').slice(0, -1).join('.')
      EXIF.getData(file.raw, function() {
        const info = EXIF.getAllTags(this)
        console.log(info)
        let datetimeStr = new Date().toString()
        if(info.DateTime) {
          const tempDateStr = info.DateTime.split(' ')
          datetimeStr = tempDateStr[0].split(':').join('-') + ' ' + tempDateStr[1]
        }
        fd.pic_shot_time = dayjs(datetimeStr).format('YYYY-MM-DD HH:mm:ss')
        fd.copyright_description = info.Copyright || ''
        if(info.PixelXDimension && info.PixelYDimension) {
          fd.pic_size = info.PixelXDimension + 'x' + info.PixelYDimension
        }
        fd.pic_no_code = dayjs(datetimeStr).toDate().getTime()
      })
    }
  }
}
</script>

<style scoped>

</style>
