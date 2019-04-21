<template>
    <div>
 <!--       <v-toolbar color="grey darken-4" dark>
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
            </v-toolbar-items>
        </v-toolbar>-->

        <v-navigation-drawer
            absolute permanent
            :mini-variant.sync="minNavDraw"
            :clipped="true"
            fixed
            app>
            <v-toolbar>
                <v-list>
                    <v-list-tile>
                        <v-spacer></v-spacer>
                        <v-list-tile-action>
                            <v-btn
                                icon
                                @click.stop="minNavDraw = !minNavDraw">
                                <v-icon v-if="!minNavDraw">chevron_left</v-icon>
                                <v-icon v-else>chevron_right</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-list>
                <v-list-tile
                    v-for="item in navigationItems"
                    v-ripple
                    @click.stop=""
                    :to="item.to">
                    <v-list-tile-action>
                        <v-icon>{{item.icon}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{item.name}}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-content>
            <v-container fluid>
                <v-flex xl4 offset-xl4 lg6 offset-lg3 md8 offset-md2 sm10 offset-sm1 xs12>
                    <router-view></router-view>
                </v-flex>
            </v-container>
        </v-content>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import router from '@/router';

@Component
export default class PublicToolbar extends Vue {
    public minNavDraw = true;

    public navigationItems = [
        {
            icon: 'exit_to_app',
            name: 'Sign in',
            to: '/',
        },
        {
            icon: 'person_add',
            name: 'Sign up',
            to: '/SignUp',
        },
    ];

//    mounted() {
//        router.beforeEach((to, from, next) => {
//            this.pageName = to.meta.title;
//            next();
//        });
//    }
}
</script>