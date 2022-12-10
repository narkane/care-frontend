<template>
  <div
    v-if="visible"
    id="login-modal"
    class="user-modal-container"
    :class="{ active: active }"
  >
    <div class="user-modal">
      <ul class="form-switcher">
        <li @click="flip('login', $event)">
          <a id="login-form" href="">Login</a>
        </li>
        <li @click="flip('register', $event)">
          <a id="register-form" href="">Register</a>
        </li>
        <li @click="flip('skip', $event)">
          <a id="skip-form" href="">Nah Later...</a>
        </li>
      </ul>
      <div
        id="form-skip"
        class="form-skip"
        :class="{ active: active == 'skip' }"
      >
        <div class="error-message" v-text="skipError" />
        <input
          id="skipSubmit"
          v-model="skipSubmit"
          type="submit"
          :class="{ disabled: submitted == 'skip' }"
          @click="submit('skip', $event)"
        />
        <div class="links">
          <a href="" @click="flip('login', $event)">Already have an account?</a>
        </div>
      </div>
      <div
        id="form-register"
        class="form-register"
        :class="{ active: active == 'register' }"
      >
        <div class="error-message" v-text="registerError" />
        <input
          v-model="registerUsername"
          type="text"
          name="user"
          placeholder="Username"
        />
        <input
          v-model="registerEmail"
          type="email"
          name="email"
          placeholder="E-mail Address"
        />
        <input
          v-model="registerPassword"
          type="password"
          name="password"
          placeholder="Password"
        />
        <input
          v-model="registerPasswordCheck"
          type="password"
          name="password"
          placeholder="Re-enter Password"
          @keyup.enter="submit('register', $event)"
        />
        <input
          id="registerSubmit"
          v-model="registerSubmit"
          type="submit"
          :class="{ disabled: submitted == 'register' }"
          @click="submit('register', $event)"
        />
        <div class="links">
          <a href="" @click="flip('password', $event)">Forgot your password?</a>
        </div>
      </div>
      <div
        id="form-login"
        class="form-login"
        :class="{ active: active == 'login' }"
      >
        <div class="error-message" v-text="loginError" />
        <input
          v-model="loginUser"
          type="text"
          name="user"
          placeholder="Username"
          @keyup.enter="submit('login', $event)"
        />
        <input
          v-model="loginPassword"
          type="password"
          name="password"
          placeholder="Password"
          @keyup.enter="submit('login', $event)"
        />
        <input
          id="loginSubmit"
          v-model="loginSubmit"
          type="submit"
          :class="{ disabled: submitted == 'login' }"
          @click="submit('login', $event)"
        />
        <div class="links">
          <a href="" @click="flip('password', $event)">Forgot your password?</a>
        </div>
      </div>
      <div
        id="form-password"
        class="form-password"
        :class="{ active: active == 'password' }"
      >
        <div class="error-message" v-text="passwordError" />
        <input
          v-model="passwordEmail"
          type="text"
          name="email"
          placeholder="Email"
          @keyup.enter="submit('password', $event)"
        />
        <input
          id="passwordSubmit"
          v-model="passwordSubmit"
          type="submit"
          :class="{ disabled: submitted == 'password' }"
          @click="submit('password', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
//   var nav = new Vue({
//     el: '#fake-nav',
//     methods: {
//       open: function (which, e) {
//         e.preventDefault()
//         modal.active = which
//       },
//     },
//   })

export default {
  // el: '#login-modal',
  data() {
    return {
      visible: true,
      active: null,
      submitted: null,

      // Submit button text
      skipSubmit: 'Just Start Drawing!',
      registerSubmit: 'Register',
      passwordSubmit: 'Reset Password',
      loginSubmit: 'Login',

      // Modal text fields
      registerUsername: '',
      registerName: '',
      registerEmail: '',
      registerPassword: '',
      registerPasswordCheck: '',
      loginUser: '',
      loginPassword: '',
      passwordEmail: '',

      // Modal error messages
      registerError: '',
      skipError: '',
      loginError: '',
      passwordError: ''
    }
  },
  mounted() {
    this.validate()
  },
  methods: {
    validateEmail() {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.registerEmail)
      ) {
        // this.registerError('Valid email address!')
        console.log('Valid email address format')
        return true
      }
      this.registerError = 'You have entered an invalid email address!'
      this.$vToastify.warning({
        body: 'Email format invalid',
        title: `Registration Failed - Please format your email properly: "username@domain"`
      })
      console.log('Invalid email address format.')
      return false
    },
    validate() {
      this.$store
        .dispatch('VALIDATE_USER_TOKEN')
        .then((user) => {
          if (user.data === false) {
            this.active = 'login'
          } else {
            this.visible = false

            document.getElementById('ui').style.visibility = 'visible'
            // console.log(user)
          }
        })
        .catch((err) => {
          console.log(`error: ${err}`)
        })
    },
    close(e) {
      e.preventDefault()
      if (e.target === this.$el) {
        this.active = null
        this.visible = false
        console.log(`visible? - ${this.visible}`)
      }
    },
    flip(which, e) {
      e.preventDefault()
      if (which !== this.active) {
        this.active = which
      }
    },
    submit(which, e) {
      e.preventDefault()
      this.submitted = which
      const data = {
        form: which
      }

      switch (which) {
        case 'skip':
          this.$store
            .dispatch('REGISTER')
            .then((res) => {
              console.log('res', res)
              this.validate()
            })
            .catch((err) => {
              this.$vToastify.warning({
                body: err.response.data.msg,
                title: `Registration Failed - ${err.response.statusText}: ${err.response.status}`
              })
            })
          break
        case 'register':
          if (this.validateEmail()) {
            data.username = this.registerUsername
            data.email = this.registerEmail
            data.password = this.registerPassword
            data.passwordCheck = this.registerPasswordCheck
            this.$store
              .dispatch('REGISTER', data)
              .then((res) => {
                console.log('Register Success: ', res)
                this.validate()
              })
              .catch((err) => {
                this.$vToastify.warning({
                  body: err.response.data.msg,
                  title: `Registration Failed - ${err.response.statusText}: ${err.response.status}`
                })
                console.log(err)
              })
          }
          break
        case 'login':
          data.username = this.loginUser
          data.password = this.loginPassword
          // this.$set('loginSubmit', 'Logging In...')
          this.$store
            .dispatch('LOGIN', data)
            .then(() => {
              this.validate()
            })
            .catch((err) => {
              this.$vToastify.warning({
                body: err.response.data.msg,
                title: `Login Failed - ${err.response.statusText}: ${err.response.status}`
              })
            })
          break
        case 'password':
          data.email = this.passwordEmail
          this.$set('passwordSubmit', 'Resetting Password...')
          break
      }
    }
  }
}
</script>

<style scoped>
.error-message {
  color: red;
  padding-bottom: 25px;
}
.login-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  justify-content: center;
  background-color: #000000da;
}

.user-modal-container * {
  box-sizing: border-box;
}

.user-modal-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  visibility: visible;
  cursor: pointer;
  overflow-y: auto;
  z-index: 3;
  font-family: 'Lato', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif';
  font-size: 14px;
  background-color: rgba(17, 17, 17, 0.9);
  -webkit-transition: all 0.25s linear;
  -moz-transition: all 0.25s linear;
  -o-transition: all 0.25s linear;
  -ms-transition: all 0.25s linear;
  transition: all 0.25s linear;
  pointer-events: initial;
}

.user-modal-container.active {
  opacity: 1;
  visibility: visible;
}

.user-modal-container .user-modal {
  position: relative;
  margin: 50px auto;
  width: 90%;
  max-width: 500px;
  background-color: #f6f6f6;
  border-radius: 20px;
  cursor: initial;
}

.user-modal-container .form-login,
.user-modal-container .form-register,
.user-modal-container .form-skip,
.user-modal-container .form-password {
  padding: 25px 25px 25px;
  display: none;
}

.user-modal-container .form-login.active,
.user-modal-container .form-register.active,
.user-modal-container .form-skip.active,
.user-modal-container .form-password.active {
  display: block;
}

.user-modal-container ul.form-switcher {
  margin: 0;
  padding: 0;
  display: flex;
}

.user-modal-container ul.form-switcher li {
  list-style: none;
  display: inline-block;
  /* min-width: 100%; */
  /* float: left; */
  /* flex-grow: 1; */
  flex: 1 0 100px;
  margin: 0;
}

.user-modal-container ul.form-switcher li a {
  width: 100%;
  display: block;
  height: 50px;
  line-height: 50px;
  color: #666666;
  background-color: #dddddd;
  text-align: center;
}

.user-modal-container ul.form-switcher li a.active {
  color: #000000;
  background-color: #f6f6f6;
}

.user-modal-container input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #eeeeee;
}

.user-modal-container input[type='submit'] {
  color: #f6f6f6;
  border: 0;
  margin-bottom: 0;
  background-color: #3fb67b;
  cursor: pointer;
}

.user-modal-container input[type='submit']:hover {
  background-color: #3aa771;
}

.user-modal-container input[type='submit']:active {
  background-color: #379d6b;
}

.user-modal-container .links {
  text-align: center;
  padding-top: 25px;
}

.user-modal-container .links a {
  color: #3fb67b;
}

.user-modal-container input[type='submit'].disabled {
  background-color: #98d6b7;
}
</style>
