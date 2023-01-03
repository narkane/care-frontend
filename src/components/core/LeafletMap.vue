<template>
  <div id="map"></div>
</template>

<script>
import L from 'leaflet'
import axios from 'axios'
import mercator from 'projections/mercator'

export default {
  data() {
    return {
      map: null,
      geoBounds: {
        sw: null,
        ne: null
      },
      cellRectangles: [[]],
      lastFetchRegionTime: 0
    }
  },
  mounted() {
    this.map = L.map('map').setView([51.505, -0.09], 3)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map)
    this.drawGoogleGridsIntoRegion()
    // this.drawCell(400, 400, { color: 'blue' })
    this.initColorMap()
  },
  methods: {
    // eslint-disable-next-line max-statements
    drawGoogleGridsIntoRegion() {
      // this.unloadGoogleGrid()
      this.setBounds()
      this.currentScale = 0 // this.breakLayer()
      // !! create drawLine(percent) method
      const test = { x: 0, y: 0 }
      let alternateSign = false

      this.googleLinesLat = []
      this.googleLinesLng = []
      this.googleGridLat = []
      this.googleGridLng = []
      const gridSizeAtScale = 1 / Math.pow(29, this.currentScale + 1)
      const swCorner = mercator({
        lat: this.geoBounds.sw.lat,
        lon: this.geoBounds.sw.lng
      })
      const neCorner = mercator({
        lat: this.geoBounds.ne.lat,
        lon: this.geoBounds.ne.lng
      })
      const screenBounds = {
        bottom: swCorner.y + gridSizeAtScale - (swCorner.y % gridSizeAtScale),
        top: neCorner.y + gridSizeAtScale - (neCorner.y % gridSizeAtScale),
        left: swCorner.x + gridSizeAtScale - (swCorner.x % gridSizeAtScale),
        right: neCorner.x + gridSizeAtScale - (neCorner.x % gridSizeAtScale)
      }
      console.table(screenBounds)
      for (
        // let y = screenBounds.top;
        // y <= screenBounds.bottom;
        // y += gridSizeAtScale
        let y = 0;
        y <= 1;
        y += gridSizeAtScale
      ) {
        test.y = y
        let ret = mercator(test)

        this.googleLinesLat.push({
          lat: ret.lat,
          lng: -180
        })
        this.googleLinesLat.push({ lat: ret.lat, lng: 0 })
        this.googleLinesLat.push({
          lat: ret.lat,
          lng: 180
        })

        test.y += gridSizeAtScale
        ret = mercator(test)

        this.googleLinesLat.push({
          lat: ret.lat,
          lng: 180
        })
        this.googleLinesLat.push({ lat: ret.lat, lng: 0 })
        this.googleLinesLat.push({
          lat: ret.lat,
          lng: -180
        })
      }

      for (
        // let x = screenBounds.left;
        // screenBounds.left > screenBounds.right
        //   ? x <= screenBounds.right || x >= screenBounds.left
        //   : x <= screenBounds.right;
        // x += gridSizeAtScale
        let x = 0;
        x <= 1;
        x += gridSizeAtScale
      ) {
        // Flip over the EVIL LINE
        if (x >= 1) {
          x -= 1
        }
        // console.log('X: ', x)

        test.x = x
        const ret = mercator(test)

        // NOTE ⁡⁢⁣⁣-⁡ ⁡⁢⁣⁣removed currentscale array and add try catch ⁡⁢⁣⁣to bounds change⁡⁡

        // Alternate draw directions to avoid cross threading issues
        this.googleLinesLng.push({
          lat: alternateSign ? -90 : 90,
          lng: ret.lon
        })
        this.googleLinesLng.push({
          lat: alternateSign ? 90 : -90,
          lng: ret.lon
        })
        alternateSign = !alternateSign
      }
      this.googleGridLat = L.polyline(this.googleLinesLat, {
        // geodesic: false,
        color: '#504515',
        opacity: 1.0,
        weight: 1
        // zIndex: 2
      })
      this.googleGridLng = L.polyline(this.googleLinesLng, {
        // geodesic: false,
        color: '#504515',
        opacity: 1.0,
        weight: 1
        // zIndex: 2
      })
      // }
      // Draw Grid (now that loaded above) at current scale
      this.googleGridLng.addTo(this.map)
      this.googleGridLat.addTo(this.map)
    },
    drawCell(x, y, data) {
      // Remove any old colored cell if exists
      // if (this.cellRectangles[`${x},${y}`]) {
      //   this.cellRectangles[`${x},${y}`].setMap(null)
      // }
      if (this.cellRectangles[`${x},${y}`]) {
      } else {
        const currentCell = {}
        const cellsAtCurrentScale = Math.pow(29, 1 + 1)
        currentCell.x = x / cellsAtCurrentScale
        currentCell.y = y / cellsAtCurrentScale

        const merc = mercator(currentCell)
        // const mY = mercator(currentCellY)

        // const cellWidth = 360 / cellsAtCurrentScale
        const cellWidthInDegrees = 360 / Math.pow(29, 1 + 1)
        const cellSizeInPercent = 1 / Math.pow(29, 1 + 1)
        currentCell.x += cellSizeInPercent
        currentCell.y += cellSizeInPercent
        const mercCellSizeInDegrees = mercator(currentCell)

        // console.log(
        //   'CELLLLLLS FINAL FOAM!!: ',
        //   cellWidthInDegrees,
        //   merc,
        //   mercCellSizeInDegrees
        // )

        this.cellRectangles[`${x},${y}`] = L.rectangle(
          // const cell = new this.google.maps.Rectangle({
          // color: '#000000',
          // opacity: 1,
          // strokeWeight: 0,
          [
            [merc.lat, merc.lon + cellWidthInDegrees],
            [mercCellSizeInDegrees.lat, merc.lon]
          ],
          {
            color: data.color,
            opacity: 0.7 // this.cellOpacity,
          }
          // ,
          // zIndex: 1
        )
        this.cellRectangles[`${x},${y}`].addTo(this.map)
        // console.log(`${x},${y}`)
        // cell.setMap(this.map)
      }
    },
    /** Initial fetch of all cells at rez of 2 [0-841, 0-841] */
    initColorMap() {
      // Use a Mercator Projection to cast this.bounds values to google
      // maps' equivalent "World Coordinates" values
      // sets this.bounds
      // !! WHICH IS NEEDED FOR payload region
      // this.setAllBounds()
      // this.mercCoords()
      // fetch all colored cells at rez 2
      const payload = {
        firstCell: {
          x: 0,
          y: 0
          // x: this.findSqIDByWorldCoordsRezOf2(this.bounds.sw.x),
          // y: this.findSqIDByWorldCoordsRezOf2(this.bounds.ne.y)
        },
        lastCell: {
          x: 841,
          y: 841
          // x: this.findSqIDByWorldCoordsRezOf2(this.bounds.ne.x),
          // y: this.findSqIDByWorldCoordsRezOf2(this.bounds.sw.y)
        },
        lastFetchRegionTime: this.lastFetchRegionTime
      }
      this.lastFetchRegionTime = new Date().getTime()
      // console.table(payload)

      axios
        .post(`${process.env.VUE_APP_API_URL}/cell/fetchRegion`, payload)
        .then((res) => {
          if (res.data.length !== 0) {
            Promise.all(this.drawRegionOfCells(res)).then(() => {
              console.log('mapped: ', res)
              // this.createCachedImage()
              // if (
              //   document.defaultView
              //     .getComputedStyle(
              //       document.getElementById('loading-element'),
              //       null
              //     )
              //     .getPropertyValue('visibility') === 'visible'
              // ) {
              //   // document.getElementById('loading-element').style.visibility =
              //   //   'hidden'
              //   document
              //     .getElementById('loading-element')
              //     .classList.toggle('fade-out', true)
              //   console.log('loaded!')
              // }
            })
          } else {
            // document.getElementById('loading-element').style.visibility =
            //   'hidden'
            console.error('No cells on init!')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /** Fetch all new cells at rez of 2 */
    updateColorMap() {
      // Use a Mercator Projection to cast this.bounds values to google
      // maps' equivalent "World Coordinates" values
      // sets this.bounds
      // !! WHICH IS NEEDED FOR payload region
      this.setAllBounds()
      // this.mercCoords()
      // fetch all colored cells at rez 2
      const payload = {
        firstCell: {
          x: 0,
          y: 0
          // x: this.findSqIDByWorldCoordsRezOf2(this.bounds.sw.x),
          // y: this.findSqIDByWorldCoordsRezOf2(this.bounds.ne.y)
        },
        lastCell: {
          x: 841,
          y: 841
          // x: this.findSqIDByWorldCoordsRezOf2(this.bounds.ne.x),
          // y: this.findSqIDByWorldCoordsRezOf2(this.bounds.sw.y)
        },
        lastFetchRegionTime: this.lastFetchRegionTime
      }
      this.lastFetchRegionTime = new Date().getTime()
      // console.table(payload)

      axios
        .post(`${process.env.VUE_APP_API_URL}/cell/fetchRegion`, payload)
        .then((res) => {
          if (res.data.length !== 0) {
            Promise.all(this.drawRegionOfCells(res)).then(() => {
              console.log('map updated: ', res)
              // this.createCachedImage()
            })
          } else {
            console.log('No new cells.')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /** Uses region param and maps over it with drawCell()
     *  @param {object[]} region Uses data to fill this.colorMap then calls this.drawCell() for each entry.
     *  @return {promise} region for .then() call used for loading screen termination
     */
    drawRegionOfCells(region) {
      console.log('mapping...')
      const ret = region.data.map((val) => {
        // this.colorMap[val.location] = {
        //   data: val.cellData,
        //   time: val.updatedAt
        // }
        // console.log('valllllllllllllllllllllllll: ', val)
        this.drawCell(val.location[0], val.location[1], val.cellData)
        // this.createCachedPixel(
        //   val.location[0],
        //   val.location[1],
        //   val.cellData.color
        // )
        // console.log(JSON.stringify(val))
        // console.log('dog: ', val.location[0], val.location[1], val.cellData)
      })
      // new Promise(this.createCachedImage()).then(() => {})
      // this.createCachedImage()
      // resolve('hidden')
      return ret
    },
    setBounds() {
      this.geoBounds.sw = this.map.getBounds()._southWest
      this.geoBounds.ne = this.map.getBounds()._northEast
    }
  }
}
</script>

<style scoped>
#map {
  height: 100vh;
}
</style>
