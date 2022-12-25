<template>
  <canvas
    id="selection-marquee"
    ref="select"
    @mousedown="startSelect"
    @mousemove="drawRect"
    @mouseup="stopSelect"
  ></canvas>
</template>

<script>
export default {
  data() {
    return {
      ctx: null,
      selectionMode: false,
      startPosition: {
        x: null,
        y: null
      }
    }
  },

  methods: {
    startSelect(e) {
      this.selectionMode = true
      this.startPosition.x = e.clientX
      this.startPosition.y = e.clientY
    },

    drawRect(e) {
      if (this.selectionMode) {
        console.log(this.startPosition)
        this.ctx.beginPath()
        this.ctx.rect(
          this.startPosition.x,
          this.startPosition.y,
          e.clientX - this.startPosition.x,
          e.clientY - this.startPosition.y
        )
        this.ctx.closePath()
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        this.ctx.strokeStyle = '#f00'
        this.ctx.stroke()
      }
    },

    stopSelect(e) {
      this.ctx.fillStyle = '#fff'

      this.selectionMode = false
      this.startPosition.x = null
      this.startPosition.y = null
    }
  },
  mounted() {
    this.$refs.select.height = window.innerHeight
    this.$refs.select.width = window.innerWidth
    this.ctx = this.$refs.select.getContext('2d')
    // this.ctx.fillRect(0,0,500,500);
  }
}
</script>

<style scoped>
#selection-marquee {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 5;
  background-color: red;
}
</style>
