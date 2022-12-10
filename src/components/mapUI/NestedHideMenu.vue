<template>
  <div id="nestedHideMenu">
    <img @click="showSwitchTable()" id="hideButton" :src="OpenEyeImg" />

    <table id="switchTable">
      <tr>
        <td class="emojiButton" id="emojiGridId">
          <div @click="toggleEmojiGrid()"><div class="emoji">😃</div></div>
        </td>
      </tr>
      <tr>
        <td class="emojiButton" id="colorGridId">
          <div @click="toggleColorGrid()"><div class="emoji">🎨</div></div>
        </td>
      </tr>
      <tr>
        <td class="emojiButton" id="satelightVeiwId">
          <div @click="toggleSatelight()"><div class="emoji">🛰️</div></div>
        </td>
      </tr>
      <tr>
        <td class="emojiButton" id="roadDataId">
          <div @click="toggleRoadData()"><div class="emoji">🌎</div></div>
        </td>
      </tr>
      <tr style="height: 10px"></tr>
      <tr>
        <td class="emojiButton" id="centerGPS">
          <div @click="$root.$emit('GPS-center')">
            <div class="emoji">
              <md-icon id="GPS-icon">my_location</md-icon>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import OpenEyeImg from '@/assets/hideButtonOpen.png'
import CloseEyeImg from '@/assets/hideButtonClose.png'

export default {
  data() {
    return {
      OpenEyeImg,
      CloseEyeImg,
      EyeImg: 'close',
      switchTableVisible: 'hidden',
      hideButtonVisible: 'visible',
      roadData: true,
      satelliteView: false /* mutually exclusive to road data*/,
      emojiGrid: true /* can alwase be drawn on top*/,
      colorGrid: true /* if shared with satelight or road, draw half opacity on top of other map */,
      onColor: '#3f5',
      offColor: '#ddd'
    }
  },
  emits: {
    satelliteView: ({ bool }) => {
      return bool
    }
  },
  // components: {
  //   CloseEyeImg
  // },
  methods: {
    showSwitchTable() {
      if (this.switchTableVisible !== 'visible') {
        this.switchTableVisible = 'visible'
        document.getElementById('hideButton').src = this.CloseEyeImg
      } else {
        this.switchTableVisible = 'hidden'
        document.getElementById('hideButton').src = this.OpenEyeImg
      }

      document.getElementById('switchTable').style.visibility =
        this.switchTableVisible
    },
    toggleEmojiGrid() {
      if (this.emojiGrid) {
        this.emojiGrid = false
        document.getElementById('emojiGridId').style.background = this.offColor
      } else {
        this.emojiGrid = true
        document.getElementById('emojiGridId').style.background = this.onColor
      }
    },
    toggleColorGrid() {
      if (this.colorGrid) {
        this.colorGrid = false
        document.getElementById('colorGridId').style.background = this.offColor
      } else {
        this.colorGrid = true
        document.getElementById('colorGridId').style.background = this.onColor
      }
    },
    toggleSatelight() {
      if (this.satelliteView) {
        // this.$root.$emit('satellite-view', false)
        this.satelliteView = false
        document.getElementById('satelightVeiwId').style.background =
          this.offColor
      } else {
        // this.$root.$emit('satellite-view', true)
        this.satelliteView = true
        document.getElementById('satelightVeiwId').style.background =
          this.onColor
        if (this.roadData) {
          this.roadData = false
          document.getElementById('roadDataId').style.background = this.offColor
        }
      }
    },
    toggleRoadData() {
      if (this.roadData) {
        this.roadData = false
        document.getElementById('roadDataId').style.background = this.offColor
      } else {
        this.roadData = true
        document.getElementById('roadDataId').style.background = this.onColor
        if (this.satelliteView) {
          this.satelliteView = false
          document.getElementById('satelightVeiwId').style.background =
            this.offColor
        }
      }
    }
  },
  watch: {
    emojiGrid(val) {
      this.emojiGrid = val
      this.$root.$emit('emoji-grid', val)
    },
    colorGrid(val) {
      this.colorGrid = val
      this.$root.$emit('color-grid', val)
    },
    roadData(val) {
      this.roadData = val
      if (!(this.roadData || this.satelliteView)) {
        this.$root.$emit('opaque-color-grid', true)
        this.$root.$emit('road-data', false)
      } else {
        this.$root.$emit('opaque-color-grid', false)
        this.$root.$emit('road-data', true)
      }
    },
    satelliteView(val) {
      this.satelliteView = val
      this.$root.$emit('satellite-view', val)
      if (!(this.roadData || this.satelliteView)) {
        this.$root.$emit('opaque-color-grid', true)
        this.$root.$emit('road-data', false)
      } else {
        this.$root.$emit('opaque-color-grid', false)
        this.$root.$emit('road-data', true)
      }
    }
  }
}
</script>

<style scoped>
#nestedHideMenu {
  pointer-events: initial;
}
#roadDataId {
  background: #3f5;
}
#satelightVeiwId {
  background: #ddd;
}
#emojiGridId {
  background: #3f5;
}
#colorGridId {
  background: #3f5;
}
#centerGPS {
  background: white;
}
#GPS-icon {
  color: black;
}
#hideButton {
  visibility: visible;
  background-color: white;
  opacity: 1;
  border: 1px outset #ddd;
  border-radius: 15px;
  padding: 3px;
  /* position: absolute; */

  /* bottom: 95px;
  right: 50px; */

  width: 32px;
  height: 32px;
  /* box-shadow: -2px 3px 4px #ddd; */
}
#switchTable {
  visibility: hidden;
  vertical-align: center;
  text-align: center;
  border: 0px;
  border-radius: 15px;
  /* background-color: #e0e0e0; */
  /* padding: 10px; */
  margin: 0px;
  position: absolute;
  bottom: 100px;
  right: 9px;
  z-index: 2;
}
.switchBackOn {
  background: #3f5;
  height: 10px;
  width: 20px;
  text-align: center;
  border-radius: 10px 0px 0px 10px;
  padding-left: 10px;
  margin-right: 0px;
}
.emoji {
  /* pointer-events: none; */
  cursor: pointer;
  user-select: none;
}
.switchBackOff {
  padding: 0px;
  background: #ddd;
  height: 10px;
  width: 20px;
  text-align: center;
  border-radius: 0px 10px 10px 0px;
  margin-left: 0px;
}
.emojiButton {
  width: 30px;
  height: 30px;
  /* margin: 10px; */
  border: 1px groove #ddd;
  border-radius: 15px;
  /* box-shadow: -2px 3px 2px #ddd; */
}
</style>
