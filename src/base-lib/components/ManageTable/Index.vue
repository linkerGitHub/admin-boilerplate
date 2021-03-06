<template>
  <div class="manage-table-box">
    <div class="operate-area">
      <el-button
        v-if="operateButtons.includes('add')"
        circle
        icon="el-icon-plus"
        size="small"
        @click="callNewOneDialog"
      />
      <el-button
        v-if="operateButtons.includes('edit')"
        circle
        type="primary"
        icon="el-icon-edit"
        size="small"
        @click="callEditDialog"
      />
      <el-button
        v-if="operateButtons.includes('refresh')"
        circle
        type="success"
        icon="el-icon-refresh"
        size="small"
        @click="formDataRequest"
      />
      <el-button
        v-if="operateButtons.includes('delete')"
        circle
        type="danger"
        icon="el-icon-delete"
        size="small"
        @click="deleteItems"
      />
    </div>
    <el-row style="padding: 10px 0 20px 0">
      <el-col
        v-if="enableColShowSetting"
        :span="2"
      >
        <el-popover
          v-model="innerComponentStatus.colShowSetting.popoverVisibility"
          placement="bottom"
        >
          <div style="text-align: left; margin: 0">
            <el-checkbox
              v-model="innerComponentStatus.colShowSetting.checkAll"
              :indeterminate="innerComponentStatus.colShowSetting.checkAllIndeterminate"
              @change="colShowSettingCheckAllHandle"
            >
              全选
            </el-checkbox>
            <div
              v-for="(col, index) in visibleColumnDefinition"
              :key="index"
            >
              <el-checkbox
                v-model="innerComponentStatus.tableColShowFlag[index]"
                :label="col.label"
                @change="colShowSettingCheckOneHandle($event, index)"
              >
                {{ col.label }}
              </el-checkbox>
            </div>
          </div>
          <el-button
            slot="reference"
            type="primary"
            :plain="true"
            size="small"
            icon="el-icon-setting"
          >
            显示
          </el-button>
        </el-popover>
      </el-col>
      <el-col :span="20">
        <slot name="searchBar" />
      </el-col>
    </el-row>
    <el-table
      v-loading="innerComponentStatus.table.loading"
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="tableSelectChangeHandle"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column
        v-for="(col, key) of visibleColumnDefinition"
        :key="key+1"
        :prop="col.prop"
        :class-name="(col.className ? col.className : '') + ' ' + ('tbl-col-' + key) + ' ' + (innerComponentStatus.tableColShowFlag[key] ? 'col-show' : 'col-hide')"
        :label="col.label"
        :filters="col.filters"
        :filter-method="col.filterMethod"
        :filter-placement="col.filterPlacement"
        :width="col.width"
      >
        <template v-slot="scope">
          <span v-if="col.textContent !== undefined"> {{ col.textContent(scope.row[col.prop], col, scope) }}</span>

          <span
            v-else-if="col.htmlContent !== undefined"
            v-html="col.htmlContent(scope.row[col.prop])"
          />

          <v-node-render
            v-else-if="col.nodeExpress !== undefined"
            :col="col"
            :scope="scope"
            :gen-v-node="col.nodeExpress"
          />

          <span v-else>
            {{ scope.row[col.prop] }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!--使用翻页组件-->
    <el-row :style="{'padding-top': '10px'}">
      <el-pagination
        background
        hide-on-single-page
        :current-page="innerComponentStatus.pagination.currentPage"
        :page-sizes="innerComponentStatus.pagination.pageSizes"
        :page-size.sync="innerComponentStatus.pagination.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="paginationTotalPage"
        @size-change="pageSizeChangeHandle"
        @current-change="currentPageChangeHandle"
      />
    </el-row>
    <el-dialog
      key="newOne"
      :width="newOneDialogWidth"
      :title="dialogTitle.newOne"
      :visible.sync="dialogStatus.newOne"
    >
      <slot
        name="newOneForm"
        :formData="innerFormDataTemp.newOne"
      >
        <el-form
          :model="innerFormDataTemp.newOne"
          :rules="formRule"
          :label-width="labelWidthAuto"
        >
          <el-form-item
            v-for="(field, index) in editableField"
            :key="index"
            :label="field.label"
          >
            <el-input v-model="innerFormDataTemp.newOne[field.prop]" />
          </el-form-item>
        </el-form>
      </slot>
      <template v-slot:footer>
        <div>
          <el-button @click="dialogStatus.newOne = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="newOneClickHandle(innerFormDataTemp.newOne)"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      key="edit"
      :width="editDialogWidth"
      :title="dialogTitle.edit"
      :visible.sync="dialogStatus.edit"
    >
      <slot
        name="editForm"
        :formData="innerFormDataTemp.edit"
      >
        <el-form
          :model="innerFormDataTemp.edit"
          :rules="formRule"
          :label-width="labelWidthAuto"
        >
          <el-form-item
            v-for="(field, index) in editableField"
            :key="index"
            :label="field.label"
          >
            <el-input
              v-model="innerFormDataTemp.edit[field.prop]"
              :type="innerFormDataTemp.edit[field.prop] && innerFormDataTemp.edit[field.prop].length < 80 ? 'text':'textarea'"
            />
          </el-form-item>
        </el-form>
      </slot>
      <template v-slot:footer>
        <div>
          <el-button @click="dialogStatus.edit = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="editClickHandle(innerFormDataTemp.edit)"
          >
            确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import tableDataProcessor from '../../utils/table-data-processor'
import Axios from 'axios'

export default {
  name: 'Index',
  components: {
    // 渲染函数
    VNodeRender: {
      props: {
        genVNode: {
          type: Object | Function
        },
        col: {
          type: Object,
          default: {}
        },
        scope: {
          type: Object
        }
      },
      render: function (createElement) {
        if (this.genVNode.constructor === Object) {
          return this.genVNode
        }
        if (this.genVNode.constructor === Function) {
          return this.genVNode(createElement, this.scope.row[this.col.prop], this.col, this.scope)
        }
      }
    }
  },
  props: {
    /**
     * 修改请求成功的回调
     **/
    saveSuccess: {
      type: Function,
      default() {}
    },

    /**
     * 修改成功回调
     **/
    editSuccess: {
      type: Function,
      default() {}
    },
    /**
     * 判定请求是否成功
     **/
    assertRequestSuccess: {
      type: Function,
      default(res) {
        return res.data.statusCode === 200
      }
    },
    /**
     * 操作组件
     **/
    operateButtons: {
      type: Array,
      default() {
        return ['add', 'edit', 'refresh', 'delete']
      }
    },

    /**
     * 构造新建表单绑定的数据对象
     **/
    dataShaper: {
      type: Function,
      default() {
        return {}
      }
    },

    /**
     * 编辑对话框确认按键被点击的回调
     * 默认参数为编辑的数据
     **/
    editClickHandle: {
      type: Function,
      default() {
        this.editOneFormConfirmHandle()
      }
    },
    /**
     * 新建对话框确认按键被点击的回调
     * 默认参数为编辑的数据
     **/
    newOneClickHandle: {
      type: Function,
      default() {
        this.newOneFormConfirmHandle()
      }
    },
    // 编辑对话款的宽度
    editDialogWidth: {
      type: String,
      default() {
        return '800px'
      }
    },
    // 新建对话款的宽度
    newOneDialogWidth: {
      type: String,
      default() {
        return '800px'
      }
    },
    // 是否显示顶部列显示筛选栏
    enableColShowSetting: {
      type: Boolean,
      default() {
        return true
      }
    },
    // 钩子函数，列筛选栏全选按钮预定动作开始前的回调，必须返回一个promise
    colShowCheckAllBeforeSync: {
      type: Function,
      default: (...args) => {
        return new Promise((resolve) => {
          resolve(args)
        })
      }
    },
    // 钩子函数，列筛选栏非全选按钮预定动作开始前的回调，必须返回一个promise
    colShowCheckOneBeforeSync: {
      type: Function,
      default: () => {
        return new Promise(() => {
        })
      }
    },
    /** 对应table data在显示时各个列的情况定义
     * 选项说明：
     * prop:   字符串，必须，表示要输出的值的键
     * label:  字符串，必须，表示该列显示在表头的值
     * className: 为该列自定义的class
     * width: 定义该列的显示宽度
     * textContent: 文本内容生成回调函数，参数是当前行列的值，当前列定义，当前所在行的整行值，以文本插值的形式输出
     * htmlContent: html内容生成回调函数，参数是当前行列的值，当前列定义，当前所在行的整行值，以HTML的形式输出
     * nodeExpress: VNode生成回调函数，参数是渲染函数createElement，当前行列的值，当前所在行的整行值，以VNode节点的形式输出
     * textContent, htmlContent, nodeExpress三者只能选一个，若同时存在，使用优先顺序textContent > htmlContent > nodeExpress
     * 若三者都不选用将直接显示值
     **/
    columnsDefinition: {
      type: Array,
      required: true,
      validator: (value) => {
        // 这个值必须匹配下列字符串中的一个
        if (Array.isArray(value)) {
          value.forEach(function (element) {
            if (element.prop === undefined || element.label === undefined) {
              throw new Error(
                '使用TheManageTable组件时，column内prop属性和label属性是必须的'
              )
            }
          })
          return true
        } else {
          return false
        }
      }
    },
    /**
     * 指定翻页配置，选项说明，返回的对象应该包含
     * pageSizes: 每页显示个数选择器的选项设置
     * pageSize: 每页显示条目个数
     */
    propPagination: {
      type: Object,
      default() {
        return {
          pageSizes: [5, 10, 20, 50, 100, 300, 500],
          pageSize: 10
        }
      }
    },
    /**
     * 从数据源中取得tabledata部分的数据
     */
    getTableDataFromResponse: {
      type: Function,
      default: (res) => {
        return res.data && res.data.data ? res.data.data.rows : []
      }
    },
    /**
     * 从数据源中取得总页数
     */
    getTotalPageFromResponse: {
      type: Function,
      default: (res) => {
        return res.data && res.data.data ? res.data.data.num.all : 0
      }
    },
    /**
     * 数据源url
     */
    dataSrcUrl: {
      type: String,
      required: true
    },
    /**
     * 构建网络请求器
     */
    axiosRequester: {
      validator: function(val) {
        return val.constructor === Function
      },
      default() {
        return Axios.create({
          url: this.dataSrcUrl
        })
      }
    },
    /**
     * 新建请求处理, 必须是个函数，且返回promise对象
     */
    newOneDeal: {
      type: Function,
      default(data) {
        return new Promise(resolve => {
          resolve(data)
        })
      }
    },

    /**
     * 编辑处理, 必须是个函数，且返回promise对象
     */
    editDeal: {
      type: Function,
      default(data) {
        return new Promise(resolve => {
          resolve(data)
        })
      }
    },
    /**
     * 编辑处理, 必须是个函数，且返回promise对象
     */
    beforeEditDialogOpen: {
      type: Function,
      default(data) {
        return new Promise(resolve => {
          resolve(data)
        })
      }
    },
    /**
     * 编辑处理, 必须是个函数，且返回promise对象
     */
    beforeNewOneDialogOpen: {
      type: Function,
      default(data) {
        return new Promise(resolve => {
          resolve(data)
        })
      }
    },
    /**
     * 删除处理, 必须是个函数，且返回promise对象
     */
    deleteDeal: {
      type: Function,
      default(ids) {
        return new Promise(resolve => {
          resolve({
            data: {
              id: ids.map(item => {
                return item.id
              })
            }
          })
        })
      }
    },
    /**
     * 构造翻页所需参数
     */
    constructPageParams: {
      type: Function,
      default(page) {
        return {
          skip: (page.currentPage - 1) * page.pageSize,
          take: page.pageSize
        }
      }
    }
  },
  data() {
    return {
      dialogTitle: {
        newOne: '新建',
        edit: '编辑'
      },
      // 内部暂存表单数据
      innerFormDataTemp: {
        edit: this.dataShaper(),
        newOne: this.dataShaper()
      },
      // 标识对话框状态
      dialogStatus: {
        newOne: false,
        edit: false
      },
      // 组件内部的一些状态
      innerComponentStatus: {
        // 列筛选栏的弹出框显示状态
        colShowSetting: {
          // 是否显示列显示筛选
          popoverVisibility: false,
          // 权限状态标记
          checkAllIndeterminate: false,
          checkAll: true
        },
        // 列显示标识
        tableColShowFlag: {},
        table: {
          // 初始loading为true
          loading: true,
          // 表格多选选中的id
          selected: []
        },
        // 翻页状态
        pagination: {
          // 当前页码
          currentPage: 1,
          pageSizes: [5, 20, 50, 100, 300, 500],
          pageSize: 10
        }
      },
      // sourceData，表格的数据
      sourceData: []
    }
  },
  computed: {
    // 根据column的定义计算出可以被显示在表格中的列
    visibleColumnDefinition: function () {
      return tableDataProcessor.searchTableData(function (item) {
        return item.visible !== false
      }, this.columnsDefinition)
    },
    tableData: {
      get () {
        return this.getTableDataFromResponse(this.sourceData)
      },
      set (val) {
        let tmp = this.getTableDataFromResponse(this.sourceData)
        tmp = []
        tmp = tmp.concat(val)
        return tmp
      }
    },
    paginationTotalPage: function () {
      return this.getTotalPageFromResponse(this.sourceData)
    },
    formRule: function () {
      const ret = {}
      this.columnsDefinition.forEach(item => {
        if(item.validRule) {
          ret[item.prop] = item.validRule
        }
      })
      return ret
    },
    editableField: function () {
      return this.columnsDefinition.filter(item => {
        return item.editable
      })
    },
    labelWidthAuto: function () {
      let width = 36 + 12
      this.columnsDefinition.forEach(item => {
        const tmp = item.label.length * 18 + 12
        if(tmp > width) {
          width = tmp
        }
      })
      return width + 'px'
    }
  },
  watch: {
    // TODO 根据columnDefinition配置相应字段的初始显示状态，目前是全部开启的，后续需要修改再补充
    columnsDefinition: function () {
      this.columnsDefinition.forEach((item, index) => {
        this.$set(this.innerComponentStatus.tableColShowFlag, index, true)
      })
    },
    dataSrcUrl: {
      handler(val, oldVal) {
        if(val !== oldVal) {
          this.axiosRequester.defaults.url = val
          this.formDataRequest()
        }
      }
    }
  },
  beforeMount() {
    const thisView = this
    this.columnsDefinition.forEach(function (item, index) {
      thisView.$set(thisView.innerComponentStatus.tableColShowFlag, index, true)
    })
  },
  mounted() {
    // 翻页
    this.innerComponentStatus.pagination = {
      ...this.innerComponentStatus.pagination,
      ...this.propPagination
    }
    // 网络请求器配置
    this.axiosRequester.defaults.url = this.dataSrcUrl

    // 首次请求数据
    this.formDataRequest()
  },
  methods: {
    // 删除请求
    deleteItems() {
      if(this.innerComponentStatus.table.selected.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一条进行删除操作。'
        })
      } else {
        this.$confirm('此操作将删除这些条目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteDeal(this.innerComponentStatus.table.selected).then(res => {
            console.log(res)
            this.axiosRequester.request({
              method: 'delete',
              ...res
            }).then(resolve => {
              if(resolve.data.success) {
                // TODO 成功后数据操作，后续需要完善

              }
            })
          })
        })
      }
    },
    // 新建请求
    newOneFormConfirmHandle() {
      this.newOneDeal(this.innerFormDataTemp.newOne).then((res) => {
        this.newOneSaveReq(res)
        this.dialogStatus.newOne = false
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err
        })
      })
    },
    // 保存新增网络请求
    newOneSaveReq(res) {
      this.axiosRequester.request({
        method: 'post',
        data: res
      }).then(ret => {
        if(this.assertRequestSuccess(ret)) {
          // TODO 成功后数据操作，后续需要完善
          this.formDataRequest()

          // 成功后回调
          this.saveSuccess()
        }
      })
    },
    // 保存编辑网络请求
    editSaveReq(res) {
      this.axiosRequester.request({
        method: 'put',
        data: res
      }).then(ret => {
        if(this.assertRequestSuccess(ret)) {
          // TODO 成功后数据操作，后续需要完善
          const idx = this.tableData.findIndex((item => {
            return item.id === res.id
          }))
          const tmp = this.tableData;
          this.$set(tmp, idx, this.innerFormDataTemp.edit)
          this.tableData = tmp

          // 成功后回调
          this.editSuccess()
        }
      })
    },
    // 编辑请求
    editOneFormConfirmHandle() {
      const detachedData = JSON.parse(JSON.stringify(this.innerFormDataTemp.edit))
      this.editDeal(detachedData).then((res) => {
        this.editSaveReq(res)
        this.dialogStatus.edit = false
      }).catch(err => {
        this.$message({
          type: 'warning',
          message: err
        })
      })
    },
    // 呼出新建一条对话框
    callNewOneDialog() {
      this.beforeNewOneDialogOpen(this.innerFormDataTemp.newOne).then((res) => {
        this.innerFormDataTemp.newOne = res || this.innerFormDataTemp.newOne
        this.dialogStatus.newOne = true
      })
    },
    // 呼出编辑一条
    callEditDialog() {
      if(this.innerComponentStatus.table.selected.length > 1) {
        this.$message({
          type: 'warning',
          message: '编辑操作仅允许选择一项，您选择了多项'
        })
      } else if(this.innerComponentStatus.table.selected.length === 0) {
        this.$message({
          type: 'warning',
          message: '编辑操作仅允许选择一项，请选择一项'
        })
      } else {
        const tmp = JSON.parse(JSON.stringify(this.innerComponentStatus.table.selected[0]))
        this.beforeEditDialogOpen(tmp).then((res) => {
          this.innerFormDataTemp.edit = res || tmp
          this.dialogStatus.edit = true
        })
      }
    },
    // 列筛选栏全选checkbox勾选或取消的处理
    // eslint-disable-next-line no-unused-vars
    colShowSettingCheckAllHandle(val) {
      const thisView = this
      this.columnsDefinition.forEach(function (item, index) {
        thisView.$set(thisView.innerComponentStatus.tableColShowFlag, index, val)
      })
      this.innerComponentStatus.colShowSetting.checkAllIndeterminate = false
    },

    // 列筛选栏非全选的checkbox勾选或取消的处理
    // eslint-disable-next-line no-unused-vars
    colShowSettingCheckOneHandle(val, index) {
      this.innerComponentStatus.tableColShowFlag[index] = val
      let trueCount = 0
      let falseCount = 0
      for (let colState in this.innerComponentStatus.tableColShowFlag) {
        trueCount += this.innerComponentStatus.tableColShowFlag[colState] ? 1 : 0
        falseCount += this.innerComponentStatus.tableColShowFlag[colState] ? 0 : 1
      }
      this.innerComponentStatus.colShowSetting.checkAll = (falseCount === 0)
      this.innerComponentStatus.colShowSetting.checkAllIndeterminate = !(trueCount === 0 || falseCount === 0)
    },
    // 表格多选勾选事件处理
    tableSelectChangeHandle(val) {
      this.innerComponentStatus.table.selected = val
    },
    // 翻页大小改变的处理
    pageSizeChangeHandle(val) {
      const pagination = this.innerComponentStatus.pagination
      pagination.currentPage = 1
      this.innerComponentStatus.pagination.pageSize = val
      this.formDataRequest()
    },
    // 翻页事件处理
    currentPageChangeHandle(val) {
      this.innerComponentStatus.pagination.currentPage = val
      this.formDataRequest()
    },
    // 请求数据
    formDataRequest() {
      this.innerComponentStatus.table.loading = true
      const pagination = this.innerComponentStatus.pagination
      this.axiosRequester.request({
        params: {
          ...this.constructPageParams(pagination)
        }
      }).then(res => {
        this.sourceData = res
        this.innerComponentStatus.table.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
  .manage-table-box @{deep} {
    .col-hide {
      display: none;
    }
  }
  .manage-table-box{
    position: relative;
  }
  .operate-area{
    position: fixed;
    z-index: 2;
    left: 186px;
    top: 20vh;
    height: 150px;
    width: 42px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    @{deep} {
      .el-button{
        margin: 0;
      }
    }
  }
</style>
