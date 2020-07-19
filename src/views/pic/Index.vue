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
      :edit-dialog-close="clearSamePicTestResult"
      :new-one-dialog-close="clearSamePicTestResult"
      :extra-params="computedFilter"
    >
      <template v-slot:searchBar>
        <el-row>
          <el-col :span="12">
            <el-form inline>
              <el-button
                size="small"
                type="success"
                @click="enablePics"
              >
                启用
              </el-button>
              <el-button
                size="small"
                type="warning"
                @click="disablePics"
              >
                禁用
              </el-button>
            </el-form>
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;"
          >
            <el-form inline>
              <el-select
                v-model="filter.item_status"
                size="small"
              >
                <el-option
                  :value="''"
                  label="所有"
                />
                <el-option
                  v-for="(s, k) of statusMap"
                  :key="k"
                  :value="k"
                  :label="s"
                />
              </el-select>
            </el-form>
          </el-col>
        </el-row>
      </template>
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
              v-popover:samePicTestPopNew
              :upload-url="uploadUrl"
              :file-list-of-uploader.sync="uploaderFile.newOne"
              :limit="1"
              :headers="{authorization: $store.state.auth.token}"
              :on-success-call="uploadSuccessHandleForNew"
              @change="uploaderFileChangeHandle(formData, ...arguments, 'new')"
            />

            <el-popover
              ref="samePicTestPopNew"
              v-model="samePicTestShowNew"
              placement="left"
              title="相似图片"
              width="200"
              trigger="hover"
            >
              <div
                v-if="samePicTestResult.length > 0"
              >
                <el-image
                  :src="samePicTestResult"
                />
                <div style="text-align: center;">
                  <div>差异度:{{ samePicDistance }}</div>
                  <div>(0-64之间，数值越小越相似)</div>
                </div>
              </div>
              <div v-else>
                暂无
              </div>
            </el-popover>
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
            label="作者"
            prop="author"
          >
            <el-input
              v-model="formData.author"
              type="text"
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
              v-popover:samePicTestPopEdit
              :upload-url="uploadUrl"
              :file-list-of-uploader.sync="uploaderFile.newOne"
              :file-list="[{url: picAddr + formData.pic_key + '?preview=1&width=200&watermark=false'}]"
              :limit="1"
              :headers="{authorization: $store.state.auth.token}"
              :on-success-call="uploadSuccessHandleForNew"
              @change="uploaderFileChangeHandle(formData, ...arguments, 'edit')"
            />

            <el-popover
              ref="samePicTestPopEdit"
              v-model="samePicTestShowEdit"
              placement="left"
              title="相似图片"
              width="200"
              trigger="hover"
            >
              <div
                v-if="samePicTestResult.length > 0"
              >
                <el-image
                  :src="samePicTestResult"
                />
                <div style="text-align: center;">
                  <div>差异度:{{ samePicDistance }}</div>
                  <div>(0-64之间，数值越小越相似)</div>
                </div>
              </div>
              <div v-else>
                暂无
              </div>
            </el-popover>
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
            label="作者"
            prop="author"
          >
            <el-input
              v-model="formData.author"
              type="text"
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
import {getPic, getPicById, updatePic} from '@/api'
import dayjs from 'dayjs'
import {picDHash} from '@/views/utils/picDHash'
import statusMap from '@/constant/itemStatusMap'

window.dayjs = dayjs
export default {
  name: 'Index',
  components: {SelectWithRemoteSearch, GetPositionFromMap, Uploader, ManageTable},
  data() {
    return {
      statusMap,
      filter: {
        item_status: ''
      },
      samePicTestShowNew: false,
      samePicTestShowEdit: false,
      samePicTestResult: '',
      samePicDistance: '',
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
                src: config.baseURL + '/retrieve-file/' + val + '?preview=1&width=200&watermark=false',
                lazy: true,
                fit: 'cover'
              },
              style: {
                'min-width': '200px'
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
          prop: 'author',
          label: '作者'
        },
        {
          prop: 'pic_description',
          label: '图片描述'
        },
        {
          prop: 'copyright_description',
          label: '版权说明'
        },
        {
          prop: 'item_status',
          label: '状态',
          textContent: function (val) {
            return statusMap[val]
          }
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
  computed: {
    computedFilter: function () {
      if(this.filter.item_status === '') {
        return {}
      }
      return this.filter
    }
  },
  methods: {
    disablePics() {
      const selected = this.$refs.manager.innerComponentStatus.table.selected
      const ld = this.$loading()
      selected.forEach(item => {
        updatePic({
          id: item.id,
          item_status: '0'
        })
        item.item_status = '0'
      })
      ld.close()
    },
    enablePics() {
      const selected = this.$refs.manager.innerComponentStatus.table.selected
      const ld = this.$loading()
      selected.forEach(item => {
        updatePic({
          id: item.id,
          item_status: '1'
        })
        item.item_status = '1'
      })
      ld.close()
    },
    clearSamePicTestResult() {
      this.samePicTestResult = ''
      this.samePicDistance = ''
      this.samePicTestShowNew = false
      this.samePicTestShowEdit = false
    },
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
        copyright_description: '暂无',
        pic_thing_right: '暂无',
        item_status: 1,
        lat_lng: [],
        pic_description: '',
        pic_key: '',
        pic_no_code: '',
        pic_shot_time: '',
        pic_size: '',
        place: [],
        street: [],
        time_stage: [],
        collection: [],
        tag: [],
        author: '暂无',
        d_hash: 0
      }
    },
    editDeal(data) {
      const tmp = data
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
      return new Promise(resolve => {
        resolve(tmp)
      })
    },
    uploaderFileChangeHandle(fd, file, type) {
      const fileReader = new FileReader()
      fileReader.onloadend = (e) => {
        picDHash(e.target.result).then(res => {
          fd.d_hash = res
          getPic({
            skip: 0,
            take: 1,
            d_hash: res,
            order_by: 'hd'
          }).then(re => {
            if(re.data.data.rows.length > 0) {
              this.samePicTestResult = config.baseURL + '/retrieve-file/' + re.data.data.rows[0].pic_key + '?preview=1&width=200&watermark=false'
              if(type === 'edit') {
                this.samePicTestShowEdit = true
              } else {
                this.samePicTestShowNew = true
              }

              this.samePicDistance = re.data.data.rows[0].hd
            } else {
              this.samePicTestResult = ''
            }
          })
        })
      }
      fileReader.readAsDataURL(file.raw);

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
        fd.copyright_description = info.Copyright || '暂无'
        if(info.PixelXDimension && info.PixelYDimension) {
          fd.pic_size = info.PixelXDimension + 'x' + info.PixelYDimension
        }
        fd.pic_no_code = dayjs(datetimeStr).format('YYYYMMDD_HHmm-') + new Date().getMilliseconds()
      })
    }
  }
}
</script>

<style scoped>

</style>
