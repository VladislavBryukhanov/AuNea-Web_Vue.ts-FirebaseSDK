<template>
    <v-sheet class="chat"
        elevation="6">

        <v-toolbar>
            <template  v-if="interlocutor">
                <v-btn icon @click="$router.go(-1)">
                    <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-list-tile avatar>
                    <v-list-tile-avatar>
                        <img :src="interlocutor.avatarUrl"/>
                        <UserNetworkStatus :userStatus="interlocutor.status"/>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                        <v-list-tile-title>{{interlocutor.login}}</v-list-tile-title>
                        <v-list-tile-action-text>{{interlocutor.status}}</v-list-tile-action-text>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-toolbar>

        <div class="messagesContent">
            <v-container bg fill-height grid-list-md text-xs-center v-if="isMessagesFetched()">
                <v-layout row wrap align-center>
                    <v-flex>
                        <v-progress-circular
                            :size="100"
                            :width="10"
                            indeterminate
                            color="primary">
                        </v-progress-circular>
                    </v-flex>
                </v-layout>
            </v-container>

            <template v-for="message in messages">
                <div class="message"
                    :class="isMyMessage(message.who) ? 'outcome' : 'incoming'">
                    <!--<div class="arrow-left"></div>-->
                    <span class="content">
                        {{message.content}}
                        <img v-if="isImage(message.fileType)"
                            :src="message.fileUrl"/>
                    </span>
                    <div class="dateOfSend">
                        <div>{{formatDateTime(message.dateOfSend)}}</div>
                        <div>{{formatDateDay(message.dateOfSend)}}</div>
                    </div>
                </div>
            </template>
        </div>
        <MessageInput
            :isDisabled="isMessagesFetched()"
            :interlocutor="interlocutorUid">
        </MessageInput>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MessageInput from '@/components/MessageInput.vue';
import UserNetworkStatus from '@/components/UserNetworkStatus.vue';
import moment from 'moment';
import _ from 'lodash';

@Component({
    components: {
        MessageInput,
        UserNetworkStatus
    },
})
export default class Chat extends Vue {

    mounted() {
        this.$store.dispatch('getInterlocutor', this.interlocutorUid);
        this.$store.dispatch('getChat', this.interlocutorUid);
    }

    get interlocutorUid() {
        return this.$route.params.id;
    }
    get messages() {
        return this.$store.state.currentChat.messages;
    }
    get interlocutor() {
        return this.$store.state.currentChat.interlocutor;
    }

    public isMessagesFetched() {
        return _.isEmpty(this.messages);
    }

    public isMyMessage(owner) {
        return this.$store.state.myAccount.uid === owner;
    }

    public formatDateTime(date) {
        return moment(date).format('HH:MM:SS')
    }

    public formatDateDay(date) {
        return moment(date).format('DD MMM')
    }

    public isImage(fileType) {
        return fileType === 'image';
    }
}
</script>

<style lang="scss">
    @import "../assets/scss/pages/Chat";
</style>