<template>
    <v-flex xl12 lg8 offset-lg2 md8 offset-md2 sm10 offset-sm1 xs12>
        <v-sheet
            elevation="6"
            class="sign">
            <form v-if="isSignUp" @submit="signUp">
                <v-text-field
                    v-model="login"
                    :counter="20"
                    label="Login"
                    required>
                </v-text-field>

                <v-btn block type="submit">
                    Sign up
                </v-btn>
            </form>
            <form v-else @submit="signIn">
                <v-btn block type="submit">
                    Sign in
                </v-btn>
            </form>
        </v-sheet>
    </v-flex>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Sign extends Vue {

    @Prop({type: Boolean, default: false})
    public isSignUp: boolean;

    public login: string = '';

    signUp(e: Event) {
        e.preventDefault();
        this.$store.dispatch('signUp', this.login);
    }

    signIn(e: Event) {
        e.preventDefault();
        this.$store.dispatch('signIn');
    }
}
</script>

<style lang="scss">
    @import url('../assets/scss/Sign.scss');
</style>