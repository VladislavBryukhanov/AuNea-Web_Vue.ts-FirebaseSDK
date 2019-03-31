<template>
    <div>
<!--
        <v-toolbar color="grey darken-4" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>{{pageName}}</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
-->

        <v-navigation-drawer
            app permanent clipped
            :mini-variant.sync="minNavDraw">
            <v-toolbar >
                <v-list>
                    <v-list-tile
                        v-ripple="minNavDraw"
                        @click.stop=""
                        avatar>
                        <v-list-tile-avatar
                            @click.stop="minNavDraw = !minNavDraw">
                            <img :src="myProfile.avatarUrl" />
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>{{myProfile.login}}</v-list-tile-title>
                        </v-list-tile-content>

                        <v-list-tile-action>
                            <v-btn
                                icon
                                @click.stop="minNavDraw = !minNavDraw">
                                <v-icon>chevron_left</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-toolbar>

            <v-list>
                <v-list-tile
                    v-for="item in navigationItems"
                    :to="item.to"
                    v-ripple
                    @click.stop="item.action">
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
            <v-container fluid app fill-height>
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
import {User} from "../../models/User";

@Component
export default class PublicToolbar extends Vue {
//        public pageName: string = 'AuNea2';

    public navigationItems = [
        {
            icon: 'group',
            name: 'User list',
            to: '/UserList',
        },
        {
            icon: 'chat',
            name: 'Dialogs',
            to: '/UserList2',
        },
        {
            icon: 'settings',
            name: 'Profile',
            to: '/Profile',
        },
        {
            icon: 'power_settings_new',
            name: 'Sign out',
            action: this.logOut,
        },
    ];

    public minNavDraw = true;

//        mounted() {
//            router.beforeEach((to, from, next) => {
//                this.pageName = to.meta.title;
//                next();
//            });
//        }

/*
    mounted() {
        this.$store.dispatch('watchNetworkStatus');
    }

    beforeDestroy() {
        this.$store.dispatch('unwatchNetworkStatus');
    }
*/

    get myProfile(): User {
        return this.$store.state.myAccount;
    }

    public logOut() {
        this.$store.dispatch('signOut');
        this.$router.push('/');
    }

}
</script>

<style lang="scss">
    @import "../../assets/scss/SideBar";
</style>