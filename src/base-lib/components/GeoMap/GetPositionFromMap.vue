<template>
  <map-for-edit
    ref="map"
    :addition-map-init-job="setMapEvent"
  />
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
      marker: null
    }
  },
  watch: {
    value: function () {
      if(this.convertedValue.length > 0) {
        if(this.marker !== null) {
          this.setValueMarkerToMap()
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
  },
  methods: {
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
  },
  computed: {
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
  }
}
</script>

<style scoped>

</style>
