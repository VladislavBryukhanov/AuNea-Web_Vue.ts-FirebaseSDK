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


                    <v-menu
                        bottom
                        transition="slide-y-transition">
                        <template v-slot:activator="{ on }">
                            <span class="content" v-on="on" v-ripple>
                                {{message.content}}
                                <img v-if="isImage(message.fileType)"
                                     :src="message.fileUrl"/>
                            </span>
                        </template>

                        <v-list>
                            <v-list-tile
                                v-for="(item, i) in menuOptions"
                                :key="i"
                                @click="item.action(message.uid)">
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>

                    <div class="dateOfSend">
                        <div>{{formatDateTime(message.dateOfSend)}}</div>
                        <div>{{formatDateDay(message.dateOfSend)}}</div>
                    </div>
                </div>
            </template>
        </div>
        <MessageInput
            :isDisabled="isMessagesFetched()"
            :interlocutor="interlocutor">
        </MessageInput>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { User } from '@/models/User.interface';
import MessageInput from '@/components/MessageInput.vue';
import UserNetworkStatus from '@/components/UserNetworkStatus.vue';
import moment from 'moment';
import _ from 'lodash';

@Component({
components: {
    MessageInput,
    UserNetworkStatus,
},
})
export default class Chat extends Vue {

    @State('myAccount', { namespace: 'Auth' })
    private myAccount: User;

    @State('currentChat', { namespace: 'Chat' })
    currentChat: Chat;

    @Action('getInterlocutor', { namespace: 'Chat' })
    private getInterlocutor;

    @Action('getChat', { namespace: 'Chat' })
    private getChat;

    @Action('disposeChat', { namespace: 'Chat' })
    private disposeChat;

    @Action('deleteMessage', { namespace: 'Chat' })
    public deleteMessage;

    public menuOptions = [
        {
            title: 'Edit',
            action: () => null,
        },
        {
            title: 'Delete',
            action: (uid) => this.deleteMessage(uid),
        },
    ];

    public updated() {
        const container = this.$el.querySelector('.messagesContent');
        container.scrollTop = container.scrollHeight;
    }

    public mounted() {
        this.getInterlocutor(this.dialogUid);
        this.getChat(this.dialogUid);
    }

    public beforeDestroy() {
        this.disposeChat();
    }

    get dialogUid() {
        return this.$route.params.id;
    }
    get messages() {
        if (this.currentChat) {
            return this.currentChat.messages;
        }
    }
    get interlocutor() {
        if (this.currentChat) {
            return this.currentChat.interlocutor;
        }
    }

    public isMessagesFetched() {
        return _.isEmpty(this.messages);
    }

    public isMyMessage(owner) {
        if (this.myAccount) {
            return this.myAccount.uid === owner;
        }
    }

    public isImage(fileType) {
        return fileType === 'image';
    }

    public formatDateTime(date) {
        return moment(date).format('hh:mm:ss');
    }

    public formatDateDay(date) {
        return moment(date).format('DD MMM');
    }
}
</script>

<style lang="scss">
    @import "../assets/scss/pages/Chat";
</style>