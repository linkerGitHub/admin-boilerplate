<template>
  <div
    class="color-pan"
    @click="colorSelectAgent"
  >
    <span
      colorval="#E49357"
      style="background-color:#E49357"
    />
    <span
      colorval="#FFFF00"
      style="background-color:#FFFF00"
    />
    <span
      colorval="#00FF00"
      style="background-color:#00FF00"
    />
    <span
      colorval="#00FFFF"
      style="background-color:#00FFFF"
    />
    <span
      colorval="#0000FF"
      style="background-color:#0000FF"
    />
    <span
      colorval="#FF00FF"
      style="background-color:#FF00FF"
    />
    <span
      colorval="#D0DF9F"
      style="background-color:#D0DF9F"
    />
    <span
      colorval="#B4D39E"
      style="background-color:#B4D39E"
    />
    <span
      colorval="#DD6F4C"
      style="background-color:#DD6F4C"
    />
    <span
      colorval="#64C3A4"
      style="background-color:#64C3A4"
    />
    <span
      colorval="#FFF376"
      style="background-color:#FFF376"
    />
    <span
      colorval="#BAD174"
      style="background-color:#BAD174"
    />
    <span
      colorval="#42B5E9"
      style="background-color:#42B5E9"
    />
    <span
      colorval="#6848FF"
      style="background-color:#6848FF"
    />
    <span
      colorval="#A3639D"
      style="background-color:#A3639D"
    />
    <span
      colorval="#DB71A1"
      style="background-color:#DB71A1"
    />
    <span
      colorval="#DC7079"
      style="background-color:#DC7079"
    />
    <span
      colorval="#E79B2F"
      style="background-color:#E79B2F"
    />
    <span
      colorval="#9BC144"
      style="background-color:#9BC144"
    />
    <span
      colorval="#FF0004"
      style="background-color:#FF0004"
    />
    <span
      colorval="#00954D"
      style="background-color:#00954D"
    />
    <span
      colorval="#009FE2"
      style="background-color:#009FE2"
    />
    <span
      colorval="#9CE8E8"
      style="background-color:#9CE8E8"
    />
    <span
      colorval="#0C74E4"
      style="background-color:#0C74E4"
    />
    <span
      colorval="#86227F"
      style="background-color:#86227F"
    />
    <span
      colorval="#5CC8C8"
      style="background-color:#5CC8C8"
    />
    <span
      colorval="#B05959"
      style="background-color:#B05959"
    />
    <span
      colorval="#B6AA37"
      style="background-color:#B6AA37"
    />
  </div>
</template>

<script>
export default {
  name: 'ColorPan',
  model: {
    prop: 'value',
    event: 'color-change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedColor: '#E49357'
    }
  },
  mounted() {
    if (this.value !== '') {
      this.selectedColor = this.value
    }
  },
  methods: {
    colorSelectAgent(e) {
      const colorVal = e.target.getAttribute('colorval')
      if (colorVal !== null) {
        if (this.$el.getElementsByClassName('color-btn-active').length > 0) {
          this.$el.getElementsByClassName('color-btn-active')[0].removeAttribute('class')
        }
        e.target.setAttribute('class', 'color-btn-active')
        if (colorVal !== this.selectedColor) {
          this.$emit('color-change', colorVal)
        }
        this.selectedColor = colorVal
        this.$emit('color-select', colorVal)
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .color-pan{
    width: 207px;
    position: relative;
    text-align: left;
    padding: 8px;
    margin: auto;
    background-color: rgba(245,245,245,.2);
    border: solid 1px rgba(255,255,255,.2);
    overflow: hidden;
    border-radius: 3px;
    > span {
      width: 20px;
      height: 20px;
      padding: 5px;
      display: inline-block;
      border: none;
      position: relative;
      margin: 2px;
      border-radius: 3px;
    }
    > span.color-btn-active{
      &:after{
        content: '.';
        font-size: 0;
        display: inline-block;
        width: 28px;
        height: 28px;
        border: 1px solid #999;
        position: absolute;
        top: -4px;
        left: -4px;
      }
    }
  }
</style>
