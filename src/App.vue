<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  beforeMount() {
    this.$store.dispatch('reloadPlace')
    this.$store.dispatch('reloadStreet')
    this.$store.dispatch('reloadTimeStage')
  }
}
</script>

<style>
#app {
  color: #4A4A4A;
}
  body{
    overflow: auto;
  }
</style>
