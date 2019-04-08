<template>
    <v-form class="messageInput" @submit="sendMessage()" >
        <input
            v-model.trim="messageContent"
            placeholder="Enter message"/>
        <v-btn flat icon>
            <v-icon>send</v-icon>
        </v-btn>
    </v-form>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Chat extends Vue {
    public messageContent = '';

    sendMessage() {
        console.log("SEND")
    }
}
</script>

<style lang="scss">
    @import "../assets/scss/MessageInput";
</style>