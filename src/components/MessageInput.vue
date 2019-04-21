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

    public sendFile() {
        this.$store.dispatch('Chat/sendFile');
    }

    public sendMessage() {
        if (_.isEmpty(this.messageContent.trim())) {
            return;
        }
        const  msg = {
            who: this.$store.state.Auth.myAccount.uid,
            to: this.interlocutor.uid,
            content: this.messageContent,
            dateOfSend: moment().toObject(),
            read: false,
        };
        this.messageContent = '';
        this.$store.dispatch('Chat/sendMessage', msg);
    }
}
</script>

<style lang="scss">
    @import "../assets/scss/components/MessageInput";
</style>