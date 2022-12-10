<template>
  <md-card id="cell-inspect" md-with-hover md-swipeable ref="target">
    <onClickOutside @trigger="clickOutside">
      <md-card-header id="card-header">
        <md-card-header-text>
          <div class="md-title">{{ name }}</div>
          <div class="md-subhead">
            Location: {{ cellLocation }}<br />
            Owner: {{ owner }}<br />
          </div>
        </md-card-header-text>
        {{ emojiLocation }}
      </md-card-header>

      <md-card-media-actions>
        <md-card-media>
          <img
            src="https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg"
            alt="Cover"
          />
        </md-card-media>
        <md-card-actions id="card-actions">
          <md-button class="md-icon-button">
            <md-icon>favorite</md-icon>
          </md-button>

          <md-button class="md-icon-button">
            <md-icon>bookmark</md-icon>
          </md-button>

          <md-button class="md-icon-button">
            <md-icon>share</md-icon>
          </md-button>
        </md-card-actions>
      </md-card-media-actions>
    </onClickOutside>
  </md-card>
</template>

<script>
import { ref } from 'vue'
// import { onClickOutside } from '@vueuse/core'
import { OnClickOutside } from '@vueuse/components'
// import { defineComponent } from '@vue/composition-api'
// import 'vue-material/dist/vue-material.min.css'

export default {
  data() {
    return {
      cOutsideCount: 0
    }
  },
  props: {
    name: null,
    owner: null,
    cellLocation: null,
    emojiLocation: null
  },
  components: {
    OnClickOutside
  },
  mounted() {
    // for desktop to not require two clicks to exit inspect
    document.addEventListener('contextmenu', () => {
      this.clickOutside()
    })
  },
  methods: {
    clickOutside() {
      const vis = document.getElementById('cell-inspect').style.visibility
      console.log(vis)
      if (vis === 'visible') {
        this.cOutsideCount++
        console.log('click outside count: ', this.cOutsideCount)

        if (this.cOutsideCount === 2) {
          document.getElementById('cell-inspect').style.visibility = 'hidden'
          this.cOutsideCount = 0
        }
      }
    }
  }
  // setup() {
  //   const target = ref(null)
  //   // const that = this
  //   onClickOutside(target, (event) => {
  //     // target.value = false
  //     console.log(
  //       `clicked outside inspect: [event - ${JSON.stringify(event) + target}]`,
  //       event
  //     )
  //     // document.getElementById('cell-inspect').style.visibility = 'hidden'
  //     if (event.pointerType === 'mouse') {
  //     }
  //   })
  //   return { target }
  // }
}
</script>

<style>
#cell-inspect {
  position: absolute;
  z-index: 9;
  visibility: hidden;
  text-align: left;
  min-width: 350;
  min-height: 300;
}
#card-header {
  background-color: #eeeeee;
}

#card-actions {
  padding-top: 0px;
}
</style>
