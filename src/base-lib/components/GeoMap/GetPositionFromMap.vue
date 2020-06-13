<template>
  <div>
    <map-for-edit
      ref="map"
      :addition-map-init-job="setMapEvent"
      style="height: 100%; width: 100%;"
    />

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

    <el-radio-group
      v-model="mapLayerSwitch"
      class="map-toggle"
      size="medium"
      @change="$refs['map'].toggleMapTileLayer()"
    >
      <el-radio-button :label="false">
        卫星
      </el-radio-button>
      <el-radio-button :label="true">
        地图
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import MapForEdit from '@/base-lib/components/GeoMap/mapForEdit'
import L from 'leaflet'

export default {
  name: 'GetPositionFromMap',
  components: {MapForEdit},
  model: {
    event: 'change'
  },
  props: {
    value: {
      type: [Array, String],
      required: true
    }
  },
  data() {
    return {
      // search
      searchTimeOut: null,
      autoComplete: {},
      posSearchVal: '',
      suggestionListStatus: {
        loading: false,
        finished: true
      },
      suggestionList: [],
      // layer switch
      mapLayerSwitch: false,
      marker: null
    }
  },
  computed: {
    filteredSuggestion: function() {
      return this.suggestionList.filter(item => {
        return item.location.lat !== undefined
      })
    },
    convertedValue() {
      if(this.value.constructor === String) {
        if(this.value.length === 0) {
          return []
        }
        return JSON.parse(this.value)
      } else {
        return this.value
      }
    }
  },
  watch: {
    value: function () {
      if(this.convertedValue.length > 0) {
        if(this.marker !== null) {
          this.setValueMarkerToMap()
          this.setCenterByValueForMap()
        } else {
          this.initialSetMarker()
        }
      } else {
        this.marker.remove()
        this.marker = null
      }
    }
  },
  mounted() {
    this.initialSetMarker()
    this.loadAmapLib()
  },
  methods: {
    loadAmapLib() {
      window.onLoad = () => {
        this.amapAutoCompleteLoad()
      }
      if(document.getElementById('amap-lib') === null) {
        const url = 'https://webapi.amap.com/maps?v=1.4.15&key=13e93d0367a43e52fc0e26d62bec0b31&callback=onLoad'
        const jsapi = document.createElement('script')
        jsapi.src = url
        jsapi.id = 'amap-lib'
        document.head.appendChild(jsapi)
      }
    },
    onCancel() {
      this.posSearchVal = ''
      this.suggestionList = []
    },
    suggestionClickHandle(item) {
      this.posSearchVal = item.name
      this.$refs['map'].setCenter(item.location.lat, item.location.lng)
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
    initialSetMarker() {
      if(this.convertedValue.length !== 0) {
        this.$nextTick(() => {
          this.createMarkerToMap(this.$refs.map.map, this.value)
          this.setValueMarkerToMap()
          this.setCenterByValueForMap()
        })
      }
    },
    setCenterByValueForMap() {
      this.$refs.map.setCenter(this.convertedValue)
    },
    setValueMarkerToMap() {
      if(this.convertedValue.length > 0) {
        this.marker.setLatLng(this.convertedValue)
      }
    },
    createMarkerToMap(map) {
      const icon = L.icon({
        iconUrl: require('./assets/marker/marker-icon.png'),
        iconSize: [26, 40],
        iconAnchor: [13, 40],
        shadowUrl: require('./assets/marker/marker-shadow.png'),
        shadowSize: [50, 50],
        shadowAnchor: [15, 50]
      });
      this.marker = L.marker([0,0]).setIcon(icon)
      this.marker.addTo(map)
    },
    setMapEvent(map) {
      map.on('click', (e) => {
        if(this.marker === null) {
          this.createMarkerToMap(map)
        } else {
          this.marker.setLatLng(e.latlng)
        }
        this.$emit('change', [e.latlng.lat, e.latlng.lng])
      })
    }
  }
}
</script>

<style scoped lang="less">
  .map-toggle{
    z-index: 999;
    position: absolute;
    bottom: 20px;
    left: 20px;
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
    line-height: 1;

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
  }
</style>
