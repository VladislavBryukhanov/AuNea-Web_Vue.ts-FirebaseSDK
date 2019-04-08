<template>
    <v-form class="messageInput" @submit="sendMessage()" >
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

    sendMessage() {
        console.log("SEND")
    }
}
</script>

<style lang="scss">
    @import "../assets/scss/MessageInput";
</style>