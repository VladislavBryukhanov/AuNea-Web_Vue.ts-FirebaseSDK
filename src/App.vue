<template>
  <div id="app">
      <router-view></router-view>
      <Snackbar></Snackbar>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import Snackbar from './components/Snackbar.vue';

@Component({
    components: {
        Snackbar,
    },
})
export default class App extends Vue {}
</script>

<style lang="scss">
    // Add unauth intersepter
    @import url('./assets/scss/App.scss');
</style>