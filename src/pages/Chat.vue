<template>
    <v-sheet class="chat"
        elevation="6">

        <v-dialog v-model="dialogOpened"
                  max-width="350">
            <v-card v-if="targetMessage">
                <v-card-title>Are you sure?</v-card-title>

                <v-card-text>
                    Do you want remove this message: '{{targetMessage.content}}'
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat
                           color="primary"
                           @click="dialogOpened = !dialogOpened">
                        Cancel
                    </v-btn>
                    <v-btn flat
                           color="darkRed"
                           @click="deleteMessage">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
                    :class="messageType(message)">
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
                            <v-list-tile>
                                <v-list-tile-title>Edit</v-list-tile-title>
                            </v-list-tile>

                            <v-list-tile
                                @click="openConfirmationDialog(message)">
                                <v-list-tile-title>Delete</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>

                    <div class="dateOfSend">
                        <div>{{formatDateTime(message.timestamp)}}</div>
                        <div>{{formatDateDay(message.timestamp)}}</div>
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
import { Message } from '../models/Message.interface';
import MessageInput from '@/components/MessageInput.vue';
import UserNetworkStatus from '@/components/UserNetworkStatus.vue';
import moment from 'moment';
import _ from 'lodash';
import { Message } from '@/models/Message.interface';

const MESSAGE_ITEM_MIN_HEIGHT = 31;

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
    private currentChat: Chat;

    @Action('getInterlocutor', { namespace: 'Chat' })
    private getInterlocutor;

    @Action('getChat', { namespace: 'Chat' })
    private getChat;

    @Action('fetchMessages', { namespace: 'Chat' })
    private fetchMessages;

    @Action('disposeChat', { namespace: 'Chat' })
    private disposeChat;

    @Action('deleteMessage', { namespace: 'Chat' })
    public deleteMessageAction;

    public dialogOpened = false;
    public targetMessage: Message = null;

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

    public async mounted() {
        this.getInterlocutor(this.dialogUid);
        this.getChat(this.dialogUid);

        const container = this.$el.querySelector('.messagesContent');
        const { clientHeight } = container;
        const limit = Math.round(clientHeight * 2 / MESSAGE_ITEM_MIN_HEIGHT);

        await this.fetchMessages({ chatId: this.dialogUid, limit });
        container.scrollTop = container.scrollHeight;

        let fetch_status;
        container.addEventListener('scroll', () => {

            //TODO add prevent if all data loaded
            if (container.scrollTop <= clientHeight / 2 && fetch_status !== 'pending') {
                fetch_status = 'pending';
                this.fetchMessages({ chatId: this.dialogUid, limit })
                    .then(() => {
                        fetch_status = 'done';
                        container.scrollTop = MESSAGE_ITEM_MIN_HEIGHT * limit
                    });
            }
        })
    }

    updated() {
        const container = this.$el.querySelector('.messagesContent');
        container.scrollTop = container.scrollHeight;
    }

    public beforeDestroy() {
        this.disposeChat();
    }

    public openConfirmationDialog(message: Message) {
        this.dialogOpened = true;
        this.targetMessage = message;
    }

    public deleteMessage() {
        this.deleteMessageAction(this.targetMessage.uid);
        this.targetMessage = null;
        this.dialogOpened = false;
    }

    public isMessagesFetched() {
        return _.isEmpty(this.messages);
    }

    public messageType(message: Message) {

        if (!this.myAccount) { return; }

        if (message.who === this.myAccount.uid) {
            return message.read ? 'outcome' : 'unread'
        } else {
            return 'incoming';
        }
    }

    // TODO pipes
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
