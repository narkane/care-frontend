<template>
  <div class="swatchSelector">
    <!--One big button that closes the selectors nested windows as soon as you click anywhere outside the menue-->
    <!--it also holds a gey color and opacity to have a faded overlay drawing attention to the options-->
    <!-- <div @click="hideBothSelectorTables" id="clickOutside"></div> -->

    <!--display selected color and button to open swatch selector-->
    <table id="selectedSwatchTable">
      <tr>
        <td @click="showHueSelector()" class="td" id="selectedSwatch"></td>
      </tr>
    </table>

    <div id="selection-tool">
      <md-icon>select_all</md-icon>
    </div>

    <!--layer one table to pick hue-->
    <table class="selectorTable" id="hueSelectorTable">
      <tr>
        <td @click="selectHue(0)" class="td" id="hue0"></td>
        <td @click="selectHue(1)" class="td" id="hue1"></td>
        <td @click="selectHue(2)" class="td" id="hue2"></td>
        <td @click="selectHue(3)" class="td" id="hue3"></td>
        <td @click="selectHue(4)" class="td" id="hue4"></td>
        <td @click="selectHue(5)" class="td" id="hue5"></td>
        <td @click="selectHue(6)" class="td" id="hue6"></td>
        <td @click="selectHue(7)" class="td" id="hue7"></td>
        <td @click="selectHue(8)" class="td" id="hue8"></td>
        <td @click="selectHue(9)" class="td" id="hue9"></td>
        <td @click="selectHue(10)" class="td" id="hue10"></td>
        <td @click="selectHue(11)" class="td" id="hue11"></td>
        <td @click="selectHue(12)" class="td" id="hue12"></td>
      </tr>
    </table>

    <!--layer 2 table to select the saturation-->
    <table class="selectorTable" id="saturationSelectorTable">
      <tr>
        <td @click="selectSaturation(0)" class="td" id="sat0"></td>
        <td @click="selectSaturation(1)" class="td" id="sat1"></td>
        <td @click="selectSaturation(2)" class="td" id="sat2"></td>
        <td @click="selectSaturation(3)" class="td" id="sat3"></td>
        <td @click="selectSaturation(4)" class="td" id="sat4"></td>
        <td @click="selectSaturation(5)" class="td" id="sat5"></td>
        <td @click="selectSaturation(6)" class="td" id="sat6"></td>
        <td @click="selectSaturation(7)" class="td" id="sat7"></td>
        <td @click="selectSaturation(8)" class="td" id="sat8"></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SwatchSelector',
  data() {
    return {
      selectedSwatch: '#FFFFFF',
      hueSelectorTableVisibility: 'hidden',
      saturationSelectorTableVisibility: 'hidden',
      clickOutsideVisibility: 'hidden',
      selectedHue: 0,
      // this table has has collums of hue options 0=greyscale and 1-8 on each being that hues saturation options.
      swatchTable: {
        0: {
          0: '#000000',
          1: '#202020',
          2: '#404040',
          3: '#606060',
          4: '#808080',
          5: '#A0A0A0',
          6: '#C0C0C0',
          7: '#E0E0E0',
          8: '#FFFFFF'
        },
        1: {
          0: '#330019',
          1: '#660033',
          2: '#99004C',
          3: '#CC0066',
          4: '#FF007F',
          5: '#FF3399',
          6: '#FF66BB',
          7: '#FF99CC',
          8: '#FFCCE5'
        },
        2: {
          0: '#330033',
          1: '#660066',
          2: '#990099',
          3: '#CC00CC',
          4: '#FF00FF',
          5: '#FF33FF',
          6: '#FF66FF',
          7: '#FF99FF',
          8: '#FFCCFF'
        },
        3: {
          0: '#190033',
          1: '#330066',
          2: '#4C0099',
          3: '#6600CC',
          4: '#7F00FF',
          5: '#9933FF',
          6: '#B266FF',
          7: '#CC99FF',
          8: '#E5CCFF'
        },
        4: {
          0: '#000033',
          1: '#000066',
          2: '#000099',
          3: '#0000CC',
          4: '#0000FF',
          5: '#3333FF',
          6: '#6666FF',
          7: '#9999FF',
          8: '#CCCCFF'
        },
        5: {
          0: '#001933',
          1: '#003366',
          2: '#004C99',
          3: '#0066CC',
          4: '#0080FF',
          5: '#3399FF',
          6: '#66B2FF',
          7: '#99CCFF',
          8: '#CCE5FF'
        },
        6: {
          0: '#003333',
          1: '#006666',
          2: '#009999',
          3: '#00CCCC',
          4: '#00FFFF',
          5: '#33FFFF',
          6: '#66FFFF',
          7: '#99FFFF',
          8: '#CCFFFF'
        },
        7: {
          0: '#003319',
          1: '#006633',
          2: '#00994C',
          3: '#00CC66',
          4: '#00FF80',
          5: '#33FF99',
          6: '#66FFB2',
          7: '#99FFCC',
          8: '#CCFFE5'
        },
        8: {
          0: '#003300',
          1: '#006600',
          2: '#009900',
          3: '#00CC00',
          4: '#00FF00',
          5: '#33FF33',
          6: '#66FF66',
          7: '#99FF99',
          8: '#CCFFCC'
        },
        9: {
          0: '#193300',
          1: '#336600',
          2: '#4C9900',
          3: '#66CC00',
          4: '#80FF00',
          5: '#99FF33',
          6: '#B2FF66',
          7: '#CCFF99',
          8: '#E5FFCC'
        },
        10: {
          0: '#333300',
          1: '#666600',
          2: '#999900',
          3: '#CCCC00',
          4: '#FFFF00',
          5: '#FFFF33',
          6: '#FFFF66',
          7: '#FFFF99',
          8: '#FFFFCC'
        },
        11: {
          0: '#331900',
          1: '#663300',
          2: '#994C00',
          3: '#CC6600',
          4: '#FF8000',
          5: '#FF9933',
          6: '#FFB266',
          7: '#FFCC99',
          8: '#FFE5CC'
        },
        12: {
          0: '#330000',
          1: '#660000',
          2: '#990000',
          3: '#CC0000',
          4: '#FF0000',
          5: '#FF3333',
          6: '#FF6666',
          7: '#FF9999',
          8: '#FFCCCC'
        }
      }
    }
  },
  methods: {
    // this makes the faded box overlay and hue selector be drawn
    showHueSelector() {
      if (this.hueSelectorTableVisibility !== 'visible') {
        this.hueSelectorTableVisibility = 'visible'
        // this.clickOutsideVisibility = 'visible'
        document.getElementById('selection-tool').style.visibility = 'visible'
        document.getElementById('hueSelectorTable').style.visibility =
          this.hueSelectorTableVisibility
        // document.getElementById('clickOutside').style.visibility =
        //   this.clickOutsideVisibility
      } else {
        this.hideBothSelectorTables()
      }
    },
    // when you pick a hue it sets the swatch you tapped and this runns to brings up the second menue full of saturation options.
    // that way if you just pick a hue and tap out of the menue it still has that set and ready to use.
    showSaturationSelector() {
      this.saturationSelectorTableVisibility = 'visible'
      document.getElementById('saturationSelectorTable').style.visibility =
        this.saturationSelectorTableVisibility
    },
    // when you click the faded screen sized box it will hide both tables and store the hue.
    hideBothSelectorTables() {
      this.saturationSelectorTableVisibility = 'hidden'
      this.hueSelectorTableVisibility = 'hidden'
      // this.clickOutsideVisibility = 'hidden'
      document.getElementById('selection-tool').style.visibility = 'hidden'
      document.getElementById('hueSelectorTable').style.visibility =
        this.hueSelectorTableVisibility
      document.getElementById('saturationSelectorTable').style.visibility =
        this.saturationSelectorTableVisibility
      // document.getElementById('clickOutside').style.visibility =
      //   this.clickOutsideVisibility
    },
    // this sets hue as the selected swatch and looks up the swatches from the table populating there respective css values
    selectHue(Hue) {
      this.selectedHue = Hue
      this.$store.dispatch('selectSwatch', this.swatchTable[Hue][4])
      document.getElementById('selectedSwatch').style.backgroundColor =
        this.$store.getters.selectedSwatch
      for (let i = 0; i < 9; i++) {
        document.getElementById(`sat${i}`).style.backgroundColor =
          this.swatchTable[Hue][i]
      }
      this.showSaturationSelector()
      // console.log(this.$store.getters.selectedSwatch)
    },
    selectSaturation(sat) {
      this.$store.dispatch(
        'selectSwatch',
        this.swatchTable[this.selectedHue][sat]
      )
      document.getElementById('selectedSwatch').style.backgroundColor =
        this.$store.getters.selectedSwatch
      this.hideBothSelectorTables()
      // console.log(this.$store.getters.selectedSwatch)
    }
  }
}
</script>

<style scoped>
#selection-tool {
  position: fixed;
  bottom: 95px;
  right: 11px;
  padding: 3px;
  border: 1px outset #fff;
  border-radius: 50%;
  background-color: #ccc;
  /* box-shadow: #777 0px 0px 7px; */
  visibility: hidden;
}
#selection-tool .md-icon {
  color: black;
}
.selectorTable {
  border: 0px;
  border-radius: 15px;
  /* background-color: #e0e0e0; */
  /* padding: 10px; */
  position: absolute;
  bottom: 200px;
  right: -138px;
  z-index: 1;
  /* border: black 3px solid; */
}
.td {
  /* visibility: true; */
  border: 1px groove #fff;
  border-radius: 50%;
  min-width: 30px;
  min-height: 30px;
  width: 30px;
  height: 30px;
  z-index: 1;
  /* box-shadow: -2px 3px 3px #666; */
}
#selectedSwatchTable {
  visibility: visible;
}
#hueSelectorTable {
  visibility: hidden;
  transform: rotate(90deg);
}
#saturationSelectorTable {
  visibility: hidden;
  transform: rotate(90deg);
  bottom: 136px;
  right: -40px;
}
#selectedSwatch {
  position: relative;
  background-color: #ffffff;
  opacity: 1;
  right: -0px;
  /* box-shadow: 1px -1px 4px #000000; */
  /*these should populate from the table. so that if someone had there own swatch table it would auto populate. for now tho they are just hard coded ^^ */
}
#hue0 {
  background-color: #808080;
}
#hue1 {
  background-color: #ff007f;
}
#hue2 {
  background-color: #ff00ff;
}
#hue3 {
  background-color: #7f00ff;
}
#hue4 {
  background-color: #0000ff;
}
#hue5 {
  background-color: #0080ff;
}
#hue6 {
  background-color: #00ffff;
}
#hue7 {
  background-color: #00ff80;
}
#hue8 {
  background-color: #00ff00;
}
#hue9 {
  background-color: #80ff00;
}
#hue10 {
  background-color: #ffff00;
}
#hue11 {
  background-color: #ff8000;
}
#hue12 {
  background-color: #ff0000;
}
#sat0 {
  background-color: #ffffff;
}
#sat1 {
  background-color: #ffffff;
}
#sat2 {
  background-color: #ffffff;
}
#sat3 {
  background-color: #ffffff;
}
#sat4 {
  background-color: #ffffff;
}
#sat5 {
  background-color: #ffffff;
}
#sat6 {
  background-color: #ffffff;
}
#sat7 {
  background-color: #ffffff;
}
#sat8 {
  background-color: #ffffff;
}
.blackbox {
  border: black 2px solid;
}
.swatchSelector {
  margin: 10px;
  display: flex;
  align-self: flex-end;
  pointer-events: initial;
}
</style>
