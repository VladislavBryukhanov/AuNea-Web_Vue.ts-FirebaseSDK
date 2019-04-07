<template>
    <v-form class="messageInput" @submit="sendMessage()" >
        <v-btn flat icon :disabled="isDisabled">
            <v-icon>attach_file</v-icon>
        </v-btn>
        <input
            v-model.trim="messageContent"
            placeholder="Enter message"/>
        <v-btn flat icon :disabled="isDisabled">
            <v-icon>send</v-icon>
        </v-btn>
    </v-form>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Chat extends Vue {
    public messageContent = '';

    @Prop(Boolean)
    public isDisabled: boolean;

    @Prop(String)
    public interlocutorUid: string;

    sendMessage() {
        this.$store.dispatch('interlocutorUid', this.interlocutorUid)
        console.log("SEND")
    }
}
</script>

<style lang="scss">
    @import "../assets/scss/components/MessageInput";
</style>