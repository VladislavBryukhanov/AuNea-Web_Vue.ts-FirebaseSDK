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
            absolute permanent
            :mini-variant.sync="minNavDraw">
            <v-toolbar >
                <v-list>
                    <v-list-tile
                        avatar
                        >
                        <v-list-tile-avatar>
                            <!--<img :src="this.$store.state.myAccount.avatarUrl"/>-->
                            <img src="https://firebasestorage.googleapis.com/v0/b/messager-d15a0.appspot.com/o/messagebotforsite%40gmail.com%2FAvatar%2F9907a1c6-28d5-45f1-bf4f-64d2ca90e14d.jpeg?alt=media&token=e78466a2-1d6e-4520-bfe1-7300cad60a77"/>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>Nameless</v-list-tile-title>
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
    export default class PublicToolbar extends Vue {
//        public pageName: string = 'AuNea2';

        public navigationItems = [
            {
                icon: 'group',
                name: 'User list',
                to: '/UserList'
            },
            {
                icon: 'chat',
                name: 'Dialogs',
                to: '/Dialogs'
            },
            {
                icon: 'settings',
                name: 'Profile',
                to: '/Profile'
            },
            {
                icon: 'power_settings_new',
                name: 'Sign out',
                action: this.logOut
            }
        ];

        public minNavDraw = true;

//        mounted() {
//            router.beforeEach((to, from, next) => {
//                this.pageName = to.meta.title;
//                next();
//            });
//        }

        logOut() {
            this.$store.dispatch('signOut');
            this.$router.push('/');
        }
    }
</script>