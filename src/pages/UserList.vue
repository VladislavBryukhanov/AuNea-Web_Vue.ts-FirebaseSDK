<template>
    <v-sheet
        elevation="6"
        class="userList">
        <v-list>
            <template v-for="(user, index) in users">
                <v-list-tile
                    :key="user.uid"
                    avatar
                    v-ripple>
                <!--FIXME ripple color is not changing to custom (light grey)-->

                    <v-list-tile-avatar>
                        <img :src="user.avatarUrl">
                        <UserNetworkStatus :userStatus="user.status"/>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title v-html="user.login"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="user.nickname && `@${user.nickname}`"></v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider
                    v-if="index < users.length - 1">
                </v-divider>
            </template>
        </v-list>
    </v-sheet>
</template>

<script lang="ts">
import UserNetworkStatus from '@/components/UserNetworkStatus.vue';
import {Component, Vue, Watch} from 'vue-property-decorator';
import _ from 'lodash';
import {User} from "../models/User.interface";

@Component({
    components: {
        UserNetworkStatus,
    },
})
export default class UserList extends Vue {

    //TODO define $store e.t.c prototype
    mounted() {
        if (_.isEmpty(this.$store.state.users)) {
            this.$store.dispatch('getUsers');
        }
    }

    get users(): User[] {
        return this.$store.state.users;
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/pages/UserList";
</style>