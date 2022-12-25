<template>
  <div id="ui">
    <div id="topbar">
      <div id="tdCursor">CARE</div>
      <textarea id="link-area" spellcheck="false">
        http://www.w4a.care/
        </textarea
      >
    </div>
    <drawer id="drawer" />

    <div id="loading-element">
      <div id="loading-background">
        <PageLoading
          id="loading"
          :animation-duration="6000"
          :size="40"
          color="#1dff5e"
        />
      </div>

      <div id="loading-text">
        Loading Water4All
        <br />
        <div class="fade-in-text" id="fade">
          Zoom in and double click second grid layer to color.
        </div>
      </div>
    </div>

    <Login />

    <div id="bottombar">
      <div class="fill-bar"></div>
      <div id="bottom-buttons">
        <div>
          <NestedHideMenu />
        </div>
        <div>
          <SwatchSelector id="swatch-selector" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SwatchSelector from './SwatchSelector.vue'
import NestedHideMenu from './NestedHideMenu.vue'
import PageLoading from './PageLoading.vue'

export default {
  components: {
    SwatchSelector,
    NestedHideMenu,
    PageLoading,
    Login: () => import('./Login.vue'),
    Drawer: () => import('./Drawer.vue')
  }
}
</script>

<style scoped>
@keyframes fade-in-out {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 0;
  }
  40% {
    opacity: 0.8;
  }
  70% {
    opacity: 1;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}

.fade-out {
  opacity: 0;
  pointer-events: none;
}

#drawer {
  z-index: 5;
}

#loading-element {
  visibility: visible;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: space-around; */
  z-index: 10;
  position: fixed;
  top: 0;
  /* top: 16vh; */
  min-width: 100%;
  height: 100%;
  /* max-height: 100%; */
  background: white;
  transition: opacity 4s;
  /* scale: 150%; */
  /* background-color: blue; */
  background-image: url('../../assets/ocean.gif');
  background-size: auto 100%;
  background-position: center;
}
#loading-background {
  /* position: ; */
  display: flex;
  justify-content: center;
  pointer-events: visible;
  margin: auto auto 0 auto;
}
#loading {
  animation: fade-in 3s;
  position: absolute;
  top: 49.3vh;
  pointer-events: none;
  /* top: 49.3%; */
}
#loading-text {
  color: white; /*#3377ff;*/
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  /* font-weight: 700; */
  font-size: 12pt;
  /* animation: fade-in-out 7s; */
  position: absolute;
  width: 90%;
  top: 57vh;
  margin: 0 auto auto auto;
  /* width: 50vw; */
  text-align: center;
  /* text-shadow: -2px 2px 2px gray; */
  /* border: 3px outset gray; */
  /* opacity: 0; */
  z-index: 11;
  animation: fade-in 3s;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.fade-in-text {
  /* border: 3px solid white; */
  /* color: red; */
  font-family: Arial;
  font-size: 10pt;
  animation: fade-in-out 14s;
  display: flex;
  justify-content: center;
  position: absolute;
  /* width: 90%; */
  top: 6.5vh;
  /* margin: auto; */
  /* width: 50vw; */
  /* text-align: center; */
  color: #666;
  /* text-shadow: -2px 2px 2px gray; */
  /* border: 3px outset gray; */
  opacity: 0;
  z-index: 11;
}
#ui {
  visibility: hidden;
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* position: absolute; */
  /* z-index: 2; */
  /* width: 100vw; */
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* background-color: red; */
  /* pointer-events: none; */
  /* bottom: 22px; */
}

#topbar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* margin: *; */
  /* background-color: rgba(160, 180, 250, 0.5); */
}

#tdCursor {
  display: flex;
  align-items: center;
  flex-shrink: 1;
  font-size: 28pt;
  position: relative;
  top: 10px;
  text-align: center;
  max-width: 250px;
  height: 60px;
  visibility: visible;
  /* border-style: */
  /* border: 1px outset #eee; */
  border-radius: 20px;
  background: #c9c9c9;
  /* opacity: 0.9; */
  box-shadow: 5px 5px 5px #bbb, -5px -5px 5px #dddddd;
  /* pointer-events: initial; */
  /* border-bottom: 1px solid #121212; */
  /* font-family: 'OpenMojiColor'; */
  padding: 0px 8px 0px 8px;
}

#link-area {
  font-size: 12pt;
  font-variant-caps: all-small-caps;
  font-weight: 700;
  position: relative;
  top: 10px;
  left: 0px;
  text-align: center;
  /* background: #222; rgb(255, 244, 180); */
  height: 28px;
  /* border-top: 1px solid #181818; rgb(255, 225, 100); */
  border-radius: 0px 0px 6px 6px;
  width: 238px;
  color: black;
  transform-origin: top;
  transition: transform 750ms ease-out;
  -moz-transform: transform 750ms ease-out;
  -webkit-transition: transform 750ms ease-out;
  transform: scaleY(0);
  resize: none;
  overflow: hidden;
  visibility: hidden;
}

#tdCursor:hover ~ #link-area {
  transform: scaleY(1);
}

#link-area:hover {
  transform: scaleY(1);
}

#bottombar {
  display: flex;
  flex-direction: row;
  /* background-color: rgba(160, 180, 250, 0.5); */
  /* border-top: 3px outset rgba(200, 200, 200, 0.4); */
}

#bottom-buttons {
}

#swatch-selector {
  /* margin: 32px; */
}

.square-button {
  height: 50px;
  width: 50px;
}

.fill-bar {
  width: 100%;
}

@media screen and (max-width: 767px) {
  .sidenav {
    height: auto;
    padding: 15px;
  }
  .row.content {
    height: auto;
  }
}
</style>
