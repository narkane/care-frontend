<template>
  <v-form id="edit-account" ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="user.username"
      :rules="nameRules"
      label="Username"
      required
    ></v-text-field>

    <v-text-field
      v-model="user.email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field v-model="user.firstName" label="First Name"></v-text-field>

    <v-text-field v-model="user.lastName" label="Last Name"></v-text-field>

    <!-- <v-select
      v-model="select"
      :items="items"
      :rules="[(v) => !!v || 'Item is required']"
      label="Item"
      required
    ></v-select> -->

    <!-- <v-checkbox
      v-model="checkbox"
      :rules="[(v) => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    ></v-checkbox> -->

    <v-btn
      id="update-info-btn"
      :disabled="!valid"
      color="success"
      class="mb-4"
      @click="validate"
    >
      Update Info
    </v-btn>

    <!-- <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn> -->

    <!-- <v-btn color="warning" @click="resetValidation"> Reset Validation </v-btn> -->
    <!-- <div id="edit-spacer" /> -->
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    user: {},
    //   username: '',
    //   email: '',
    //   firstName: '',
    //   lastName: ''
    // },
    nameRules: [
      (v) => !!v || 'Name is required'
      //   (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  }),
  computed: {
    userInfo() {
      return this.$store.getters.user
    }
  },
  mounted() {
    if (this.userInfo) {
      console.log(this.userInfo)
      this.user = this.userInfo
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate()
      this.$store
        .dispatch('EDIT_USER', this.user)
        .then(() => {
          this.$vToastify.success({
            body: 'Success',
            title: `Account Updated!`
          })
        })
        .catch((err) => {
          this.$vToastify.warning({
            body: err.response.data.msg,
            title: `User Edit Failed - ${err.response.statusText}: ${err.response.status}`
          })
          console.log(err)
        })
    }
    // reset() {
    //   this.$refs.form.reset()
    // },
    // resetValidation() {
    //   this.$refs.form.resetValidation()
    // }
  }
}
</script>

<style scoped>
#edit-account {
  margin: 14px 20px 0px 20px;
}

#update-info-btn {
  /* float: center; */
  margin: 26px 8px 0px 0px;
}

/* #edit-spacer {
  background-color: blue;
  display: inline-flex;
  min-height: 100%;
} */
</style>
