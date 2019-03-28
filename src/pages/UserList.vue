<template>
    <v-sheet
        elevation="6"
        class="userList">
        <v-list>
            <template v-for="user in users">
                <v-divider></v-divider>
                <v-list-tile
                        :key="user.uid"
                        avatar
                        v-ripple
                        @click="">
                <!--FIXME ripple color is not changing to custom (light grey)-->

                    <v-list-tile-avatar>
                        <img :src="user.avatarUrl">
                        <UserNetworkStatus :userStatus="user.status"/>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title v-html="user.login"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="user.nickname"></v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-list>
    </v-sheet>
</template>

<script lang="ts">
import UserNetworkStatus from '@/components/UserNetworkStatus.vue'
import {Component, Vue, Watch} from 'vue-property-decorator';

@Component({
    components: {
        UserNetworkStatus,
    },
})
export default class UserList extends Vue {

    //TODO define $store e.t.c prototype
    mounted() {
        // TODO implement lodash
        if (this.$store.state.users.length === 0) {
            this.$store.dispatch('getUsers');
        }
    }

    get users() {
        return this.$store.state.users;
    }
}
</script>

<style lang="scss">
    @import "../assets/scss/UserList";
</style>