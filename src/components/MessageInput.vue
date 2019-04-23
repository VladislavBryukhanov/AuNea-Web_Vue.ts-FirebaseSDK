<template>
    <v-form class="messageInput" @submit.prevent="sendMessage()" >
        <v-btn flat icon :disabled="isDisabled">
            <v-icon>attach_file</v-icon>
        </v-btn>
        <input
            v-model="messageContent"
            placeholder="Enter message"/>
        <v-btn
            flat icon
            :disabled="isDisabled"
            type="submit">
            <v-icon>send</v-icon>
        </v-btn>
    </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import moment from 'moment';
import _ from 'lodash';
import { User } from '../models/User.interface';

@Component
export default class Chat extends Vue {
    public messageContent = '';

    @Prop(Boolean)
    public isDisabled: boolean;

    @Prop({type: Object as () => User})
    public interlocutor: User;

    @State('myAccount', { namespace: 'Auth'})
    private myAccount: User;

    @Action('sendFile', { namespace: 'Chat' })
    public sendFile;

    @Action('sendMessage', { namespace: 'Chat' })
    private sendMessageAction;

    public sendMessage() {
        if (_.isEmpty(this.messageContent.trim())) {
            return;
        }
        const  msg = {
            who: this.myAccount.uid,
            to: this.interlocutor.uid,
            content: this.messageContent,
            dateOfSend: moment().toObject(),
            read: false,
        };
        this.sendMessageAction(msg);
        this.messageContent = '';
    }
}
</script>

<style lang="scss">
    @import "../assets/scss/components/MessageInput";
</style>