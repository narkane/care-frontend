<template>
  <div id="fullHamburgerMenu">
    <div id="HamburgerButton0" @click="ShowMenu()">
      <table>
        <tr>
          <td class="td">
            <table>
              <tr>
                <td class="HamburgerButtonLinesSpace"></td>
              </tr>
              <tr>
                <td class="HamburgerButtonLines"></td>
              </tr>
              <tr>
                <td class="HamburgerButtonLinesSpace"></td>
              </tr>
              <tr>
                <td class="HamburgerButtonLines"></td>
              </tr>
              <tr>
                <td class="HamburgerButtonLinesSpace"></td>
              </tr>
              <tr>
                <td class="HamburgerButtonLines"></td>
              </tr>
              <tr>
                <td class="HamburgerButtonLinesSpace"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <table id="HamburgerMenu">
      <tr>
        <td class="HamburgerMenuEmoji">👤</td>
        <td class="HamburgerInnerButtons" id="Accounts" @click="account">
          Account
        </td>
      </tr>
      <tr>
        <td class="HamburgerMenuEmoji">🎨</td>
        <td class="HamburgerInnerButtons" id="Stickers">
          <a target="_blank" href="https://slides.com/d/znESk6A/live#/4/2">
            Stickers
          </a>
        </td>
      </tr>
      <tr>
        <td class="HamburgerMenuEmoji">🤖</td>
        <td class="HamburgerInnerButtons" id="Bots">
          <!-- <img src="https://i.imgur.com/aAO6tUQ.png" class="V1Sticker" /> -->
          <a target="_blank" href="https://slides.com/d/znESk6A/live#/4/3">
            Bots
          </a>
        </td>
      </tr>
      <tr>
        <td class="HamburgerMenuEmoji">💬</td>
        <td class="HamburgerInnerButtons" id="Boards">
          <!-- <img src="https://i.imgur.com/aAO6tUQ.png" class="V1Sticker" /> -->
          <a target="_blank" href="https://slides.com/d/znESk6A/live">
            Boards
          </a>
        </td>
      </tr>
      <tr>
        <td class="HamburgerMenuEmoji">🔗</td>
        <td class="HamburgerInnerButtons" id="Links">
          <a target="_blank" href="https://slides.com/d/znESk6A/live">
            <!-- <img src="https://i.imgur.com/aAO6tUQ.png" class="V1Sticker" /> -->
            Links
          </a>
        </td>
      </tr>
      <tr>
        <td class="HamburgerMenuEmoji">📈</td>
        <td class="HamburgerInnerButtons" id="Stats">
          <a target="_blank" href="https://slides.com/d/znESk6A/live">
            <!-- <img src="https://i.imgur.com/aAO6tUQ.png" class="V1Sticker" /> -->
            Stats
          </a>
        </td>
      </tr>
    </table>

    <div id="HamburgerButton1" @click="HideMenu()">
      <table>
        <tr>
          <td class="td">
            <table>
              <tr>
                <td style="height: 5px"></td>
              </tr>
              <tr>
                <td style="width: 10px"></td>
                <td class="HamburgerButtonLinesSpace"></td>
              </tr>
              <tr>
                <td></td>
                <td class="HamburgerButtonLines"></td>
              </tr>
              <tr>
                <td></td>
                <td class="HamburgerButtonLinesSpace"></td>
              </tr>
              <tr>
                <td></td>
                <td class="HamburgerButtonLines"></td>
              </tr>
              <tr>
                <td></td>
                <td class="HamburgerButtonLinesSpace"></td>
              </tr>
              <tr>
                <td></td>
                <td class="HamburgerButtonLines"></td>
              </tr>
              <tr>
                <td></td>
                <td class="HamburgerButtonLinesSpace"></td>
              </tr>
              <tr>
                <td style="width: 10px"></td>
                <td></td>
                <td style="width: 10px"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Menu: 'visible',
      HamburgerButton1: 'hidden',
      HamburgerButton0: 'visible'
    }
  },
  methods: {
    ShowMenu() {
      this.Menu = 'visible'
      document.getElementById('HamburgerMenu').style.visibility = this.Menu

      this.HamburgerButton1 = 'visible'
      document.getElementById('HamburgerButton1').style.visibility =
        this.HamburgerButton1

      this.HamburgerButton0 = 'hidden'
      document.getElementById('HamburgerButton0').style.visibility =
        this.HamburgerButton0
    },
    HideMenu() {
      this.Menu = 'hidden'
      document.getElementById('HamburgerMenu').style.visibility = this.Menu
      console.log('menu, ', this.Menu)

      this.HamburgerButton1 = 'hidden'
      document.getElementById('HamburgerButton1').style.visibility =
        this.HamburgerButton1

      this.HamburgerButton0 = 'visible'
      document.getElementById('HamburgerButton0').style.visibility =
        this.HamburgerButton0
    },
    account() {
      document.getElementById('account-card').style.visibility = 'visible'
    }
  }
}
</script>

<style scoped>
#fullHamburgerMenu {
  pointer-events: all;
}
#HamburgerMenu {
  visibility: hidden;
  background-color: rgba(200, 200, 200, 0.7);
  width: 160px;
  position: fixed;
  left: 0px;
  top: 0px;
  /* border: 3px groove #dddddd44; */
  border-radius: 0px 0px 25px 0px;
  padding: 6px;
}
tr {
  margin: 0px 14px;
}
.V1Sticker {
  height: 25px;
  width: 25px;
  z-index: 4;
  float: left;
  position: relative;
  top: 0px;
  left: 6px;
  border-radius: 5px 0px 3px 0px;
}
.HamburgerOutside {
}
.HamburgerMenuEmoji {
  width: 26px;
  border: 0px outset #ddddddbb;
  border-radius: 50%;
  box-shadow: -2px 2px 5px #444;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.7);
  /* text-align: center; */
}
.HamburgerInnerButtons {
  /* height: 10px; */
  background-color: #7fb5da;
  text-align: center;
  border: 2px;
  border-style: outset;
  border-radius: 25px 15px 25px 14px;
  box-shadow: -2px 2px 5px #444;
}
.HamburgerInnerButtons > a {
  color: white;
  left: -20px;
  text-align: left;
}
.td {
  background-color: rgba(200, 200, 200, 0.7);
  border-radius: 5px !important;
  border-collapse: collapse !important;
  border: none !important;
}
#HamburgerButton0 {
  visibility: visible;
  height: 100px;
  width: 43px;
  margin: 5px;
}
#HamburgerButton1 {
  visibility: hidden;
  width: 60px;
  margin: 5px;
  top: 175px;
  left: -6px;
  position: absolute;
  border-radius: 0px 0px 13px 0px;
  background-color: rgba(200, 200, 200, 0.6);
}
#HamburgerButton1table {
  border-radius: 10px 10px 10px 10px;
}
.HamburgerButtonLines {
  background-color: black;
  height: 5px;
  width: 43px !important;
  border-radius: 2px !important;
  border-collapse: collapse !important;
  border: none !important;
}
.HamburgerButtonLinesSpace {
  height: 2px;
  width: 43px;
}
#Accounts {
  background: rgb(200, 200, 200);
}
#Accounts:hover {
  background: rgb(160, 160, 180);
}
#Stickers {
  background: #8b8b8b;
}
#Stickers:hover {
  background: #6e5e5e;
}
#Bots {
  background: #8b8b8b;
}
#Bots:hover {
  background: #6e5e5e;
}
#Boards {
  background: #8b8b8b;
}
#Boards:hover {
  background: #6e5e5e;
}
#Links {
  background: #8b8b8b;
}
#Links:hover {
  background: #6e5e5e;
}
#Stats {
  background: #8b8b8b;
}
#Stats:hover {
  background: #6e5e5e;
}
</style>
