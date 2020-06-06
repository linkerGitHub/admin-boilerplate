<template>
  <div style="position: relative; overflow: hidden">
    <div
      :class="{'right-collapse-panel-active': drawProcedureStatus.drawDone}"
      class="right-collapse-panel"
    >
      <div class="color-select-title">
        选择轮廓颜色
      </div>
      <color-pan
        :value="initialBoundaryColor"
        @color-change="setBoundaryColor"
      />
      <div class="btn-layer-wrapper">
        <el-button
          type="primary"
          size="medium"
          @click="saveExitHandle"
        >
          保存并退出
        </el-button>
      </div>
      <div class="btn-layer-wrapper">
        <el-button
          plain
          size="medium"
          @click="restartDraw"
        >
          重新绘制
        </el-button>
      </div>
    </div>
    <div class="search-box">
      <el-input
        v-model="posSearchVal"
        placeholder="请输入搜索关键词"
        size="medium"
        clearable
        @clear="onCancel"
        @input="posSuggestListReq"
      />
      <div
        v-show="filteredSuggestion.length > 0"
        class="suggestion-box"
      >
        <ul>
          <li
            v-for="(item, idx) in filteredSuggestion"
            :key="idx"
            @click="suggestionClickHandle(item)"
          >
            <span>{{ item.name }}</span>
            <span class="district">{{ item.district }}</span>
          </li>
        </ul>
      </div>
    </div>
    <el-button
      v-show="!drawProcedureStatus.drawStarted"
      class="start-draw-btn"
      size="medium"
      type="default"
      @click="startSetBoundary"
    >
      开始绘制
    </el-button>
    <el-radio-group
      v-model="mapLayerSwitch"
      class="map-toggle"
      size="medium"
      @change="$refs['map-big'].toggleMapTileLayer()"
    >
      <el-radio-button :label="false">
        卫星
      </el-radio-button>
      <el-radio-button :label="true">
        地图
      </el-radio-button>
    </el-radio-group>
    <el-button
      v-show="drawProcedureStatus.drawStarted && !drawProcedureStatus.drawDone"
      type="danger"
      size="medium"
      class="undo-btn"
      @click="undoLastPoint"
    >
      <svg-icon icon-class="undo" />撤销
    </el-button>
    <el-button
      round
      class="geo-location-btn"
      size="medium"
      icon="el-icon-location-information"
      @click="setCenterToGeoLocation"
    />
    <map-for-edit
      ref="map-big"
      :debug="false"
      :draw-color="drawColor"
      :initial-boundary="initialBoundary"
      style="height: 80vh; width: 100%;"
      @draw-vertex-added="vertexAddedHandle"
      @draw-finish="drawFinishHandle"
    />
  </div>
</template>

<script>
import MapForEdit from './mapForEdit'
import ColorPan from './ColorPan'
export default {
  name: 'MapBoundaryDraw',
  components: { ColorPan, MapForEdit },
  props: {
    initialBoundary: {
      type: Array,
      default() {
        return []
      }
    },
    initialBoundaryColor: {
      type: String,
      default() {
        return 'white'
      }
    }
  },
  data() {
    return {
      searchTimeOut: null,
      autoComplete: {},
      posSearchVal: '',
      suggestionListStatus: {
        loading: false,
        finished: true
      },
      suggestionList: [],
      mapLayerSwitch: false,
      drawProcedureStatus: {
        drawStarted: false,
        drawing: false,
        drawDone: false
      },
      drawColor: this.initialBoundaryColor,
      geoLocation: []
    }
  },
  computed: {
    filteredSuggestion: function() {
      return this.suggestionList.filter(item => {
        return item.location.lat !== undefined
      })
    }
  },
  watch: {
    initialBoundary: function(val) {
      this.$refs['map-big'].clearDrawLayer()
      this.$refs['map-big'].setDataToDraw(val)
      this.$refs['map-big'].setBoundaryColor(this.initialBoundaryColor)
      this.setInitBoundary()
    },
    initialBoundaryColor: function(val) {
      this.$refs['map-big'].setBoundaryColor(val)
    }
  },
  mounted() {
    this.setInitBoundary()
    this.loadAmapLib()
  },
  methods: {
    onCancel() {
      this.posSearchVal = ''
      this.suggestionList = []
    },
    suggestionClickHandle(item) {
      this.posSearchVal = item.name
      this.$refs['map-big'].setCenter(item.location.lat, item.location.lng)
      this.suggestionList = []
    },
    amapAutoCompleteLoad() {
      const AMap = window.AMap
      AMap.plugin('AMap.Autocomplete', () => {
        this.autoComplete = new AMap.Autocomplete({
          datatype: 'poi'
        })
      })
    },
    posSuggestListReq() {
      const val = this.posSearchVal
      if (val !== undefined && val.constructor === String && val.length > 0 && !/^\s+$/.test(val)) {
        this.suggestionListStatus.loading = true
        this.suggestionListStatus.finished = false
        if (this.searchTimeOut !== null) {
          clearTimeout(this.searchTimeOut)
        }
        this.searchTimeOut = setTimeout(() => {
          this.searchTimeOut = null
          this.autoComplete.search(val, (status, result) => {
            if (status === 'complete') {
              // 搜索成功时，result即是对应的匹配数据
              this.suggestionList = result.tips
              this.suggestionListStatus.loading = false
              this.suggestionListStatus.finished = true
            }
            if (status === 'no_data') {
              this.$message({
                type: 'info',
                message: '没有搜索到结果'
              })
            }
          })
        }, 500)
      }
      if (this.posSearchVal.length === 0) {
        this.posSearchVal = ''
        this.suggestionList = []
      }
    },
    setCenterToGeoLocation() {
      if (this.geoLocation.length !== 0) {
        this.$refs['map-big'].setView(...this.geoLocation, 18)
      } else {
        this.$message({
          type: 'info',
          message: '定位中...'
        })
      }
    },
    getGeoLocation() {
      const thisVue = this
      const AMap = window.AMap
      AMap.plugin('AMap.Geolocation', function() {
        const geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB'
        })

        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', onComplete)
        AMap.event.addListener(geolocation, 'error', onError)

        function onComplete(data) {
          thisVue.geoLocation = [data.position.lat, data.position.lng]
        }

        function onError(data) {
          // 定位出错
          console.log('err', data)
        }
      })
    },
    loadAmapLib() {
      window.onLoad = () => {
        this.amapAutoCompleteLoad()
        this.getGeoLocation()
      }
      const url = 'https://webapi.amap.com/maps?v=1.4.15&key=6f79f8cb0b72d9d74485a5e128da28ca&callback=onLoad'
      const jsapi = document.createElement('script')
      jsapi.src = url
      document.head.appendChild(jsapi)
    },
    setInitBoundary() {
      if (this.initialBoundary.length > 0) {
        const mapComponent = this.$refs['map-big']
        mapComponent.editToggle()
        mapComponent.setBoundaryColor(this.initialBoundaryColor)
        this.setProcedureStatus(4)
      }
    },
    vertexAddedHandle() {
      const mapComponent = this.$refs['map-big']
      if (mapComponent.drawLayerVertexData.length >= 1) {
        this.setProcedureStatus(3)
      }
    },
    onSearchResult(pois) {
      this.$refs['map-big'].setCenter(pois[0].lat, pois[0].lng)
    },
    startSetBoundary() {
      const mapComponent = this.$refs['map-big']
      mapComponent.drawStartUp()
      this.setProcedureStatus(2)
    },
    undoLastPoint() {
      const mapComponent = this.$refs['map-big']
      if (mapComponent.drawLayerVertexData.length >= 1) {
        if (mapComponent.drawLayerVertexData.length === 1) {
          this.setProcedureStatus(2)
        }
        mapComponent.undoLastPoint()
        if (mapComponent.drawLayerVertexData.length === 0) {
          this.restartDraw()
        }
      } else if (mapComponent.drawLayerVertexData.length === 0) {
        this.setProcedureStatus(1)
        mapComponent.drawGiveUp()
      }
    },
    drawFinishHandle() {
      this.setProcedureStatus(4)
    },
    setBoundaryColor(color) {
      this.drawColor = color
      this.$refs['map-big'].setBoundaryColor(color)
    },
    restartDraw() {
      this.$refs['map-big'].clearDrawLayer()
      this.$refs['map-big'].drawStartUp()
      this.setProcedureStatus(2)
    },
    setProcedureStatus(stage) {
      switch (stage) {
      case 1:
        this.drawProcedureStatus.drawStarted = false
        this.drawProcedureStatus.drawing = false
        this.drawProcedureStatus.drawDone = false
        break
      case 2:
        this.drawProcedureStatus.drawStarted = true
        this.drawProcedureStatus.drawing = false
        this.drawProcedureStatus.drawDone = false
        break
      case 3:
        this.drawProcedureStatus.drawStarted = true
        this.drawProcedureStatus.drawing = true
        this.drawProcedureStatus.drawDone = false
        break
      case 4:
        this.drawProcedureStatus.drawStarted = true
        this.drawProcedureStatus.drawing = true
        this.drawProcedureStatus.drawDone = true
        break
      }
    },
    saveExitHandle() {
      const mapComponent = this.$refs['map-big']
      this.$emit('save-call', {
        boundaryLatlng: mapComponent.getDrawPointData(),
        color: this.drawColor
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .suggestion-box{
    background-color: #fff;
    position: absolute;
    top: 40px;
    border-radius: 4px;
    width: 100%;
    ul {
      list-style: none;
      padding: 0;
      li {
        cursor: pointer;
        padding: 8px 16px;
        display: flex;
        justify-content: space-between;
        .district{
          font-size: 12px;
          color: #7d7d7d;
        }
        span{
          max-width: 46%;
        }
        &:hover{
          background-color: #e6e6e6;
        }
      }
    }
  }
  .right-collapse-panel {
    background-color: rgba(40,43,49,.9);
    position: absolute;
    right: -240px;
    width: 240px;
    z-index: 999;
    height: 100%;
    box-shadow: -6px 0 20px -5px rgba(0,0,0,.4);
    transition: right 100ms linear;
  }
  .right-collapse-panel.right-collapse-panel-active{
    right: 0px;
  }
  .search-box {
    position: absolute;
    left: 20px;
    top: 20px;
    height: 34px;
    width: 275px;
    margin-right: 20px;
    z-index: 999;
    box-shadow: none;
    /deep/ .search-tips{
      border: none;
      box-shadow: 0px 0px 1px grey;
      ul li {
        height: 36px;
        width: 230px;
      }
    }
    /deep/ .search-box-wrapper .search-btn {
      background-color: $them-color;
      color: #ffffff;
    }
  }
  .start-draw-btn{
    color: $them-color;
    position: absolute;
    left: 310px;
    top: 19px;
    z-index: 999;
  }
  .map-toggle{
    z-index: 999;
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
  .undo-btn{
    z-index: 999;
    position: absolute;
    bottom: 20px;
    border-radius: 18px;
    right: 49%;
  }
  .geo-location-btn{
    z-index: 999;
    position: absolute;
    bottom: 20px;
    border-radius: 18px;
    right: 20px;
  }
  .color-select-title{
    width: 100%;
    color: #64c3a4;
    font-size: 16px;
    line-height: 40px;
    margin-top: 26px;
    font-weight: 700;
    text-align: center;
  }
  .btn-layer-wrapper{
    margin-top: 30px;
    text-align: center;
    > button {
      width: 150px;
    }
  }
</style>
