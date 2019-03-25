<template>
  <div id="app">
    <v-toolbar color="grey darken-4" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>{{pageName}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat :to="{ name: 'SingIn'}">
          Sign in
        </v-btn>
        <v-btn flat :to="{ name: 'SingUp'}">
          Sign up
        </v-btn>
        <v-btn flat :to="{ name: 'UserList'}">
          User list
        </v-btn>
        <v-btn flat @click="logOut">
          Log out
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container fluid>
      <v-flex xl4 offset-xl4 lg6 offset-lg3 md8 offset-md2 sm10 offset-sm1 xs12>
        <router-view></router-view>
      </v-flex>
    </v-container>
  </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import router from '@/router';

@Component
export default class App extends Vue {

    public pageName: string = 'AuNea';

    mounted() {
        router.beforeEach((to, from, next) => {
            this.pageName = to.meta.title;
            next();
        });
    }

    logOut() {
        this.$store.dispatch('logOut');
    }

}
</script>

<style lang="scss">
  @import url('./assets/scss/App.scss');
</style> 