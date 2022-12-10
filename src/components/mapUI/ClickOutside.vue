<template>
  <!--One big button that closes the selectors nested windows as soon as you click anywhere outside the menu-->
  <div id="clickOutside" v-if="clickOutside" @click="toggle()" />
</template>

<script>
export default {
  name: 'clickOutside',
  data() {
    return {
      // elementStyle: null,
      clickOutside: 'false'
    }
  },
  // mounted() {
  //   this.element = document.getElementById('clickOutside').style
  // },
  methods: {
    toggle() {
      this.clickOutside = !this.clickOutside
      // this.drawBox = 'visible'
      // this.elementStyle.visibility = 'visible'
      // this.elementStyle.pointerEvents = 'all'
    }
  }
}
</script>

<style scoped>
#clickOutside {
  visibility: hidden;
  position: fixed;
  background: grey;
  opacity: 44%;
  width: 100%;
  height: 100%;
  z-index: 3;
  padding: 0px;
  border: 0px;
}
</style>
