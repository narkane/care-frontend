<template>
  <div id="account-card" @click="close">
    <md-card>
      <md-card-header>
        <div class="md-title">Card without hover effect</div>
      </md-card-header>

      <md-card-content>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio itaque
        ea, nostrum odio. Dolores, sed accusantium quasi non.
      </md-card-content>

      <md-card-actions>
        <md-button>Action</md-button>
        <md-button>Action</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'Account',
  setup() {
    // const target = ref(null)
    // onClickOutside(target, (event) => {
    //   console.log(`clicked outside drawer: [event - ${event}]`)
    //   this.showNavigation = false
    // })
  },
  methods: {
    close() {
      document.getElementById('account-card').style.visibility = 'hidden'
    }
  }
}
</script>

<style lang="scss" scoped>
.md-card {
  width: 320px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
  //   justify-content: flex-start;
  max-width: 420px; // or however wide you want your content block to be
  width: 100%;
  max-height: 500px; // or however wide you want your content block to be
  height: 100%;
  //   margin-top: 2%;
  box-shadow: -6px 7px 8px #666;
  text-align: center;
  //   z-index: 10;
}
#account-card {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 13;
  display: flex;
  //   justify-content: center;
  //   align-items: center;
  visibility: hidden;
  background-color: #00000099;
}
</style>
