<template>
  <v-container fluid>
    <div class="text-center">
      <v-dialog v-model="showVerifyDialog" width="500" persistent>
        <v-card>
          <v-card-title
            class="headline grey lighten-2 black--text dlgVerifyAccount"
            primary-title
          >
            <v-icon class="orange--text">mdi-information</v-icon>
            &nbsp;{{ $t('home.VERIFY_YOUR_ACCOUNT') }}
          </v-card-title>
          <v-card-text class="mt-4">
            {{ $t('home.VERIFY_YOUR_ACCOUNT_DESCRIPTION') }}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="showVerifyDialog = false"
              class="btnClose"
              >{{ $t('home.CLOSE') }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <EmojiMap />
      <!-- <GoogleMap /> -->
    </div>
    <!-- <div style="position: absolute; z-index: 1"> -->
    <!-- </div> -->
    <!-- <div style="position: absolute; z-index: 0"> -->
    <!-- </div> -->
    <!-- <Description :description="$t('home.DESCRIPTION')" /> -->
    <!-- </v-layout> -->
    <!-- <ProjectDescription /> -->
  </v-container>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.$store.getters.appTitle,
      titleTemplate: `${this.$t('home.TITLE')} - %s`
    }
  },
  data() {
    return {
      name: this.$store.state.auth.user.name,
      showVerifyDialog: !this.$store.state.verify.emailVerified
    }
  }
}
</script>
