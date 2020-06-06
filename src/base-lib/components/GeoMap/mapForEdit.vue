<template>
  <div
    :class="{'debug-box':debug}"
    class="map-box"
  >
    <div class="map" />
    <div
      v-if="debug"
      style="background-color: #fff; padding: 20px"
    >
      <el-button @click="toggleMapTileLayer()">
        切换地图
      </el-button>
      <el-button @click="drawStartUp()">
        开始绘制
      </el-button>
      <el-button @click="drawGiveUp()">
        放弃绘制
      </el-button>
      <el-button @click="clearDrawLayer()">
        清除已绘制
      </el-button>
      <el-button @click="undoLastPoint()">
        撤销上一个点
      </el-button>
      <el-button @click="getDrawPointData()">
        获取绘制数据
      </el-button>
      <el-button @click="setDataToDraw()">
        设置绘制数据
      </el-button>
      <el-input
        v-model="debugVals.center"
        placeholder="坐标"
      />
      <el-input
        v-model="debugVals.setData"
        placeholder="图形"
      />
      <el-button @click="setCenter()">
        设置视图位置
      </el-button>
      <el-button @click="setBoundaryColor()">
        设置轮廓颜色
      </el-button>
      <el-button @click="fitBoundary()">
        适应轮廓
      </el-button>
      <el-button @click="setEventToAllPolygonPath()">
        设置事件监听器
      </el-button>
      <div>
        {{ drawLayerVertexData }}
      </div>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import L from 'leaflet'
import translation from './js/leaflet-geoman-translation'
require('leaflet.chinatmsproviders')
require('@geoman-io/leaflet-geoman-free')

export default {
  name: 'MapForEdit',
  props: {
    debug: {
      type: Boolean,
      default: false
    },
    drawColor: {
      type: String,
      default: '#b8e365'
    },
    initialBoundary: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      map: null,
      layerPicker: null,
      baseLayer: null,
      drawPointData: [],
      drawPointDataTemp: [],
      drawLayer: null,
      debugVals: {
        center: '',
        setData: ''
      },
      workingLayers: {}
    }
  },
  computed: {
    drawLayerVertexData() {
      if (this.drawLayer !== null && this.drawLayer._latlngs[0] && this.drawLayer._latlngs[0].length > 0) {
        const ret = []
        const latlngs = this.drawLayer._latlngs[0]
        for (let i = 0; i < latlngs.length; i++) {
          const tempLatlng = latlngs[i]
          ret.push([tempLatlng.lat, tempLatlng.lng])
        }
        return ret
      } else {
        return []
      }
    },
    layerStyle() {
      return {
        templineStyle: {
          color: this.drawColor
        },
        // the line from the last marker to the mouse cursor
        hintlineStyle: {
          color: this.drawColor
        },
        pathOptions: {
          // add leaflet options for polylines/polygons
          color: this.drawColor,
          fillColor: this.drawColor
        }
      }
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    // 初始化地图
    initMap() {
      // 卫星瓦片地图与普通地图
      const normalMap = L.tileLayer.chinaProvider('Google.Normal.Map', {
        maxZoom: 21,
        minZoom: 5
      })
      const routeMap = L.tileLayer.chinaProvider('Google.Satellite.Annotion', {
        maxZoom: 21,
        minZoom: 5
      })

      const baseLayers = {
        'normalMap': normalMap,
        'routeMap': routeMap
      }

      this.baseLayer = baseLayers

      const mapElem = this.$el.getElementsByClassName('map')[0]
      const map = L.map(mapElem, {
        attributionControl: false,
        center: [103.61036691794625, 32.700350524387304].reverse(),
        zoom: 17,
        layers: [routeMap],
        zoomControl: false
      })
      map.pm.setLang('zh-cus', translation)

      map.on('pm:create', (workingLayer) => {
        workingLayer.layer.pm.toggleEdit()
        this.drawLayer = workingLayer.layer
        this.$set(this.workingLayers, Math.random().toString(36).substr(2), workingLayer.layer)
        this.drawFinish()
      })

      map.on('pm:drawstart', ({ workingLayer }) => {
        this.drawLayer = workingLayer
        workingLayer.on('pm:vertexadded', e => {
          this.setVertexBorderColor()
          this.vertexAdded(e)
        })
      })
      this.map = map

      // 如果有初始数据，绘制边界
      if (this.initialBoundary.length > 0) {
        this.setDataToDraw(this.initialBoundary)
        this.fitBoundary()
      }
    },
    // 切换瓦片图层
    toggleMapTileLayer(layerName = '') {
      if (this.map.hasLayer(this.baseLayer['routeMap'])) {
        this.map.removeLayer(this.baseLayer['routeMap'])
        this.map.addLayer(this.baseLayer['normalMap'])
      } else {
        this.map.removeLayer(this.baseLayer['normalMap'])
        this.map.addLayer(this.baseLayer['routeMap'])
      }
    },
    // 启动打点
    drawStartUp() {
      this.map.pm.enableDraw('Polygon', {
        snappable: true,
        snapDistance: 20,
        ...this.layerStyle
      })
      this.setVertexBorderColor()
    },
    // 放弃打点
    drawGiveUp() {
      this.map.pm.disableDraw('Polygon')
    },
    // 清除已绘制
    clearDrawLayer() {
      if (this.drawLayer) {
        this.map.removeLayer(this.drawLayer)
      }
      for (const argumentsKey in this.workingLayers) {
        const item = this.workingLayers[argumentsKey]
        this.map.removeLayer(item)
        delete this.workingLayers[argumentsKey]
      }
    },
    // 获取打点绘制数据
    getDrawPointData() {
      return this.drawLayerVertexData
    },
    // 撤销上一个点
    undoLastPoint() {
      this.map.pm.Draw.Polygon._removeLastVertex()
    },
    // 设置中心
    setCenter(...args) {
      if (this.debug && args.length === 0) {
        this.map.setView(L.latLng(...this.debugVals.center.split(',').reverse()))
      } else {
        this.map.setView(L.latLng(...args))
      }
    },
    setZoom(...args) {
      this.map.setZoom(args)
    },
    setView(...args) {
      this.map.setView(L.latLng(args[0], args[1]), args[2])
    },
    // 打点结束回调方法，将外部方法使用prop合并或者emit事件出去
    drawFinish() {
      this.setVertexBorderColor()
      this.$emit('draw-finish', this.drawLayerVertexData)
    },
    // 设置监听事件
    setEventToAllPolygonPath(event = 'click') {
      for (const argumentsKey in this.workingLayers) {
        const item = this.workingLayers[argumentsKey]
        item._path.addEventListener(event, () => {
          item.setStyle({
            fillOpacity: 0.6
          })
        })
      }
    },
    // 设置打点数据
    setDataToDraw(data = JSON.parse(this.debugVals.setData), layerCreated, eventAttach, polygonLayer) {
      let layer = polygonLayer
      if (layer) {
        layer.setData(data)
      } else {
        layer = L.polygon(data)
      }
      this.drawLayer = layer
      layer.addTo(this.map)
      if (layerCreated) {
        layerCreated(layer, this.workingLayers, this.map)
      } else {
        this.$set(this.workingLayers, Math.random().toString(36).substr(2), layer)
      }
      if (eventAttach) {
        layer._path.addEventListener(eventAttach.trigger, () => {
          eventAttach.handler(layer, this.workingLayers, this.map)
        })
      }
    },
    editToggle() {
      this.drawLayer.pm.toggleEdit()
    },
    // 设置轮廓颜色
    setBoundaryColor(color) {
      const setColor = color || this.drawColor
      this.drawLayer.setStyle({
        color: setColor,
        fillColor: setColor
      })
      this.setVertexBorderColor(setColor)
    },
    // 设置顶点边界颜色
    setVertexBorderColor(color) {
      const setColor = color || this.drawColor
      const markerList = this.map._mapPane.getElementsByClassName('leaflet-marker-pane')[0].children
      for (let i = 0; i < markerList.length; i++) {
        const mark = markerList[i]
        mark.style.borderColor = setColor
      }
    },
    // 缩放地图自适应轮廓
    fitBoundary() {
      this.map.fitBounds(L.latLngBounds(this.drawLayer._bounds._southWest, this.drawLayer._bounds._northEast))
    },
    vertexAdded(e) {
      this.$emit('draw-vertex-added', e)
    }
  }
}
</script>

<style scoped lang="scss">
  .map {
    height: 100%;
    width: 100%;
  }
  .map-box{
    overflow: hidden;
  }
  .debug-box{
    overflow: initial!important;
  }
</style>
