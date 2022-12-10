<template>
  <div class="page-container md-layout-column">
    <md-button class="md-icon-button" @click="open">
      <md-icon
        class="md-size-2x"
        style="color: white; text-shadow: -1px 3px 7px black"
        >menu</md-icon
      >
    </md-button>

    <md-drawer
      id="drawer-menu"
      ref="target"
      v-if="target"
      :md-active.sync="showNavigation"
      md-swipeable
      style="background: #c8c8c8"
    >
      <md-toolbar class="md-primary" md-elevation="1">
        <span class="md-title">
          Care
          <!-- {{ $store.getters.user.username }} -->
        </span>
        <div id="back" @click="back">
          <div v-if="this.home">✖</div>
          <div v-if="!this.home" style="margin-right: -6px">🏠</div>
        </div>
      </md-toolbar>

      <!-- DRAWER -->
      <md-list id="drawer-list" v-if="this.focus == 'drawer'">
        <md-list-item @click="focus = 'account'">
          <!-- <md-icon>manage_accounts</md-icon> -->
          👤
          <span class="md-list-item-text">Account</span>
        </md-list-item>

        <md-list-item @click="focus = 'account'" :disabled="true">
          <!-- <md-icon>link</md-icon> -->
          🔗
          <span class="md-list-item-text">Links</span>
        </md-list-item>

        <md-list-item @click="focus = 'account'" :disabled="true">
          <!-- <md-icon>photo_library</md-icon> -->
          🎨
          <span class="md-list-item-text">Stickers</span>
        </md-list-item>

        <md-list-item @click="focus = 'account'" :disabled="true">
          <!-- <md-icon>query_stats</md-icon> -->
          📈
          <span class="md-list-item-text">Stats</span>
        </md-list-item>

        <md-list-item @click="focus = 'account'" :disabled="true">
          🤖
          <span class="md-list-item-text">Robots</span>
        </md-list-item>

        <md-list-item @click="focus = 'account'" :disabled="true">
          💬
          <span class="md-list-item-text">Boards</span>
        </md-list-item>
      </md-list>

      <!-- ACCOUNT -->
      <md-list
        id="account-list"
        v-if="this.focus == 'account'"
        style="background: #c8c8c8"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <md-list-item
              id="account-user-page"
              @click="focus = 'user-page'"
              v-on="on"
              v-bind="attrs"
            >
              <span class="md-list-item-text">
                <h2 style="text-align: center">
                  {{ $store.getters.user.username }}
                  <span id="account-emoji">💣</span>
                </h2>
              </span>
            </md-list-item>
          </template>
          <span>Account Settings</span>
        </v-tooltip>
        <md-list-item>
          <img
            id="account-placeholder"
            :src="require('@/assets/account-placeholder.png')"
          />
          <img
            id="account-placeholder-beta"
            :src="require('@/assets/beta.png')"
          />
        </md-list-item>
      </md-list>

      <!-- USER-PAGE -->
      <md-list
        id="user-page-list"
        v-if="this.focus == 'user-page'"
        style="background: #c8c8c8"
      >
        <EditAccount />
        <!-- <div>user settings</div> -->
        <md-list-item id="logout" @click="logout()">
          <span class="md-list-item-text">
            <h2 class="pr-4" style="text-align: center">Logout</h2>
          </span>
        </md-list-item>
      </md-list>
    </md-drawer>
  </div>
</template>

<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

export default {
  // name: 'Temporary',
  data: () => ({
    focus: 'drawer',
    home: true,
    showNavigation: false
  }),
  components: {
    EditAccount: () => import('./Drawer/EditAccount.vue')
  },
  setup() {
    const target = ref(null)
    // const that = this
    onClickOutside(target, (event) => {
      target.value = false
      console.log(`clicked outside drawer: [event - ${event + target}]`)
    })
    return { target }
  },
  methods: {
    open() {
      this.focus = 'drawer'
      this.showNavigation = true
      this.target = true
    },
    logout() {
      localStorage.removeItem('token')
      window.location.reload()
    },
    printUser(o) {
      let out = ''
      for (const p in o) {
        out += `${p}: ${o[p]}\n`
      }
      return out
    },
    back() {
      if (this.home === true) {
        this.target = false
      } else {
        this.focus = 'drawer'
      }
    }
  },
  watch: {
    focus() {
      if (this.focus !== 'drawer') {
        this.home = false
      } else {
        this.home = true
      }
      return this.focus
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(#000, 0.12);
  z-index: 11;
  pointer-events: none;
}

.page-container > * {
  pointer-events: all;
}

// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
  overflow: hidden;
  border: 0px solid black;
  border-radius: 0 0 15px 0px;
}

#back {
  margin-top: 2px;
  margin-left: auto;
  margin-right: 12px;
  cursor: pointer;
  font-size: 12pt;
  // color: grey;
}

.md-list {
  padding: 0px;
}

ul li button {
  border: 1px solid #aaaaaa;
  border-right: 0px;
  border-left: 0px;
  /* animate initial appearance and whenever state returns to normal from :hover */
  -webkit-animation: translate-left-in 0.3s 1 cubic-bezier(0.7, 0, 0.3, 1);
  animation: translate-left-in 0.3s 1 cubic-bezier(0.7, 0, 0.3, 1);
}
ul li button:hover {
  border-radius: 10px 0px 0px 10px;
  // background: none;
  /* animate on hover */
  -webkit-animation: translate-left-out 0.5s 1 cubic-bezier(0.7, 0, 0.3, 1);
  animation: translate-left-out 0.5s 1 cubic-bezier(0.7, 0, 0.3, 1);

  /* Keep the state after the animation has finished */
  -webkit-transform: translateX(30px);
  transform: translateX(30px);
}
.md-list-item:hover * {
  // color: #1111cc;
  cursor: default;
}

.md-content {
  padding: 16px;
}

.md-button.md-icon-button {
  height: 64px;
  width: 64px;
  margin: 8px 12px;
  // border-radius: 0px;
}

.md-button.md-icon-button md-icon {
  color: white;
}

.md-list-item-text {
  margin-top: 2px;
  margin-left: 10px;
}

#account-emoji {
}

#account-list md-list-item md-list-item-default md-list-item-content {
  padding: 0px;
}

//Override: ul li button:hover
#account-user-page button,
#account-user-page button:hover,
#logout button,
#logout button:hover {
  border-radius: 0px;

  /* animate on hover */
  -webkit-animation: none;
  animation: none;

  /* Keep the state after the animation has finished */
  -webkit-transform: none;
  transform: none;
}

#user-page-list {
  // height: 100%;
  // flex-grow: 1;
}

#account-placeholder {
  display: block;
  opacity: 0.5;
}

#account-placeholder-beta {
  position: fixed;
  // box-sizing: border-box;
  left: 0px;
  right: 0px;
  width: 100%;
  // z-index: 1;
}

#logout {
  position: fixed;
  bottom: 0px;
  width: 100%;
  // justify-content: flex-end;
}

// .md-overlay {
//   pointer-events: all;
// }

/* Keyframes */
@-webkit-keyframes translate-left-in {
  0% {
    -webkit-transform: translateX(30px);
  }
  100% {
    -webkit-transform: translateX(0);
  }
}
@keyframes translate-left-in {
  0% {
    transform: translateX(30px);
  }
  100% {
    transform: translateX(0);
  }
}

@-webkit-keyframes translate-left-out {
  0% {
    -webkit-transform: translateX(0%);
  }
  100% {
    -webkit-transform: translateX(30px);
  }
}
@keyframes translate-left-out {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(30px);
  }
}
</style>
