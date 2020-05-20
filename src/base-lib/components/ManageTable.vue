<template>
  <div class="manage-table-box">
    <el-row>
      <el-col
        v-if="enableColShowSetting"
        :span="3"
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
            v-slot:reference
            type="primary"
            :plain="true"
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
      @select-change="tableSelectChangeHandle"
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
        :current-page="innerComponentStatus.pagination.currentPage"
        :page-sizes="innerComponentStatus.pagination.pageSizes"
        :page-size.sync="innerComponentStatus.pagination.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="paginationTotalPage"
        @size-change="pageSizeChangeHandle"
        @current-change="currentPageChangeHandle"
      />
    </el-row>
  </div>
</template>

<script>
import withCallbackFuncBuilder from './utils/with-callback-func-builder'
import tableDataProcessor from '../utils/table-data-processor'
import testData from './testData'
import RestfulReq from './utils/restful-req'

export default {
  name: 'ManageTable',
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
        if (this.genVNode.constructor === 'Object') {
          return this.genVNode
        }
        if (this.genVNode.constructor === 'Function') {
          return this.genVNode(createElement, this.scope.row[this.col.prop], this.col, this.scope)
        }
      }
    }
  },
  props: {
    // 是否显示顶部列显示筛选栏
    enableColShowSetting: {
      type: Boolean,
      default: true
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
     * nodeExpress: VNode生成回调函数，参数是渲染函数createElement，参数是当前行列的值，当前所在行的整行值，以HTML的形式输出
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
        return res.data.data ? res.data.data.rows : []
      }
    },
    /**
     * 从数据源中取得总页数
     */
    getTotalPageFromResponse: {
      type: Function,
      default: (res) => {
        return res.data.data ? res.data.data.num.all : 0
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
        return val.constructor === RestfulReq
      },
      default () {
        return new RestfulReq()
      }
    }
  },
  mounted() {
    this.innerComponentStatus.pagination = Object.assign(this.innerComponentStatus.pagination, this.propPagination)
  },
  data() {
    return {
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
        //
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
      sourceData: testData.sourceData,
      // 使用回调创建工厂函数准备方法
      methodsReady: {
        colShowSettingCheckAllHandle: withCallbackFuncBuilder.New()
          .setBeforeSyncPromise(this.colShowCheckAllBeforeSync)
          .setMainFunc(val => {
            this.columnsDefinition.forEach((item, index) => {
              this.$set(this.tableColShowFlag, index, val)
            })
            this.innerComponentStatus.colShowSetting.checkAllIndeterminate = false
          }).buildFunc(),
        colShowSettingCheckOneHandle: withCallbackFuncBuilder.New()
          .setBeforeSyncPromise(this.colShowCheckOneBeforeSync)
          .setMainFunc((val, index) => {
            this.tableColShowFlag[index] = val
            let trueCount = 0
            let falseCount = 0
            for (const colState in this.tableColShowFlag) {
              trueCount += this.tableColShowFlag[colState] ? 1 : 0
              falseCount += this.tableColShowFlag[colState] ? 0 : 1
            }
            const colShowSetting = this.innerComponentStatus.colShowSetting
            colShowSetting.checkAll = falseCount === 0
            colShowSetting.checkAllIndeterminate = !(
              trueCount === 0 || falseCount === 0
            )
          }).buildFunc()
      }
    }
  },
  computed: {
    // 根据column的定义计算出可以被显示在表格中的列
    visibleColumnDefinition: function () {
      return tableDataProcessor.searchTableData(function (item) {
        return item.visible !== false
      }, this.columnsDefinition)
    },
    tableData: function () {
      return this.getTableDataFromResponse(this.sourceData)
    },
    paginationTotalPage: function () {
      return this.getTotalPageFromResponse(this.sourceData)
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
      handler(val) {
        this.axiosRequester.setReqUrl(val)
        this.formDataRequest()
      },
      immediate: true
    }
  },
  methods: {
    // 列筛选栏全选checkbox勾选或取消的处理
    colShowSettingCheckAllHandle(...args) {
      this.methodsReady.colShowSettingCheckAllHandle(args)
    },

    // 列筛选栏非全选的checkbox勾选或取消的处理
    colShowSettingCheckOneHandle(...args) {
      this.methodsReady.colShowSettingCheckOneHandle(args)
    },
    // 表格多选勾选事件处理
    tableSelectChangeHandle(val) {
      this.table.selected = val
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
      this.axiosRequester.reqGet({
        skip: (pagination.currentPage - 1) * pagination.pageSize,
        take: pagination.pageSize
      }).then(res => {
        this.sourceData = res
        this.innerComponentStatus.table.loading = false
      })
    }
  }
}
</script>

<style scoped></style>
