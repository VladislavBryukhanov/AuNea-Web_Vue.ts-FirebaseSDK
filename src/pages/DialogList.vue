<template>
    <v-sheet
        elevation="6">
        <v-list>
            <template v-for="(dialog, index) in dialogs">
                <v-list-tile
                    :key="index"
                    avatar
                    v-ripple
                    @click="">
                    <v-badge
                        class="unreadCounter"
                        color="outcomeMessage"
                        v-model="$store.state.myAccount.uid !== dialog.lastMessage.who && dialog.unreadCounter > 0"
                        overlap>
                        <v-list-tile-avatar>
                            <img :src="dialog.speaker.avatarUrl"/>
                            <UserNetworkStatus :userStatus="dialog.speaker.status"/>
                        </v-list-tile-avatar>
                        <template v-slot:badge>{{dialog.unreadCounter}}</template>
                    </v-badge>

                    <v-list-tile-content>
                        <v-list-tile-title>{{dialog.speaker.login}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{dialog.lastMessage.content}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                        <v-list-tile-action-text>{{formatDate(dialog)}}</v-list-tile-action-text>
                    </v-list-tile-action>
                </v-list-tile>

                <v-divider
                    v-if="index < dialogs.length - 1">
                </v-divider>
            </template>
        </v-list>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import UserNetworkStatus from '@/components/UserNetworkStatus.vue'
import { Dialog } from "../models/Dialog.interface";
import moment from 'moment';

@Component({
    components: {
        UserNetworkStatus
    }
})
export default class DialogList {
    mounted() {
        if (_.isEmpty(this.dialogs)) {
            this.$store.dispatch('getDialogs');
        }
    }

    public formatDate(dialog) {
        return moment(dialog.lastMessage.dateOfSend).format('DD MMM');
    }

    get dialogs() {
        return this.$store.state.dialogs;
    }
}
</script>

<style lang="scss">
    @import '../assets/scss/DialogList';
</style>