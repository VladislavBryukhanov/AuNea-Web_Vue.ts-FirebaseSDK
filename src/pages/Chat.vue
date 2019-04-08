<template>
    <v-sheet class="chat"
        elevation="6">
        <div class="messagesContent">
            <template v-for="message in messages">
                <div v-if="isMyMessage(message.who)"
                     class="message outcome">
                    <!--<div class="arrow-left"></div>-->
                    <span class="content">
                        {{message.content}}
                    </span>
                </div>
                <div class="message incoming" v-else>
                    <!--<div class="arrow-left"></div>-->
                    <span class="content">
                        {{message.content}}
                    </span>
                </div>
            </template>
        </div>
        <MessageInput></MessageInput>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MessageInput from '@/components/MessageInput.vue';

@Component({
    components: {
        MessageInput,
    },
})
export default class Chat extends Vue {

    mounted() {
        this.$store.dispatch('getChat', this.$route.params.id);
    }

    get messages() {
        return this.$store.state.messages;
    }

    isMyMessage(owner) {
        return this.$store.state.myAccount.uid === owner;
    }

}
</script>

<style lang="scss">
    @import "../assets/scss/Chat";
</style>