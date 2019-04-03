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
                    <v-list-tile-avatar>
                        <img :src="dialog.speaker.avatarUrl"/>
                        <UserNetworkStatus :userStatus="dialog.speaker.status"/>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>{{dialog.speaker.login}}</v-list-tile-title>
                        <v-list-tile-sub-title>{{dialog.lastMessage.content}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-divider
                    v-if="index < dialogs.length - 1">
                </v-divider>
            </template>
        </v-list>
    </v-sheet>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
import UserNetworkStatus from '@/components/UserNetworkStatus.vue'

@Component({
    components: {
        UserNetworkStatus
    }
})
export default class DialogList {
    mounted() {
        if (_.isEmpty(this.$store.state.dialogs)) {
            this.$store.dispatch('getDialogs');
        }
    }

    get dialogs() {
        return this.$store.state.dialogs;
    }
}
</script>