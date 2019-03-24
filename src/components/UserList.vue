<template>
    <div>
        UserList:
        <div class="userList" v-for="user in users">
            <div class="user">
                <div class="avatar">
                    <span class="onlineStatus"></span>
                    <img :src='user.avatarUrl'/>
                </div>
                <div class="userBody">
                    <p class="login">{{user.login}}</p>
                    <p class="nickname">@{{user.nickname}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class UserList extends Vue {

    public users = [];

    //TODO define $store e t c proto
    mounted() {
        this.$store.dispatch('getUsers');
    }

    get users() {
        return this.$store.state.users;
    }
}
</script>

<style lang="scss">
    /*@import url(styles.scss);*/
</style>