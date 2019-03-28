<template>
  <div id="app">
      <router-view></router-view>
      <v-snackbar
          :timeout="duration"
          v-model="showSnackbar"
      >
          {{this.message}}
          <v-btn
              flat
              @click="showSnackbarAlert = false"
          >
            close
          </v-btn>
      </v-snackbar>
  </div>
</template>

<script lang="ts">

    import {Component, Vue, Watch} from "vue-property-decorator";

@Component
export default class App extends Vue {

    public showSnackbar = false;
    public message = '';
    public duration = 500;

    @Watch('$store.state.snackbar')
    onSnackbarMessage(val) {
        this.showSnackbar = true;
        this.message = val.message;
        this.duration = val.duration;
    }
}

</script>

<style lang="scss">
    // Add unauth intersepter
    @import url('./assets/scss/App.scss');
</style> 