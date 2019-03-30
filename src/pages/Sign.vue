<template>
    <v-flex xl12 lg8 offset-lg2 md8 offset-md2 sm10 offset-sm1 xs12>
        <v-sheet
            elevation="6">
            <div class="sign">
                <!--<img src="../assets/LastLogopsd.png"-->
                     <!--class="logo"/>-->

                <form v-if="isSignUp" @submit.prevent="signUp">
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

                <form v-else @submit.prevent="signIn">
                    <v-btn block type="submit">
                        Sign in
                    </v-btn>
                </form>
            </div>
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

    public signUp() {
        this.$store.dispatch('signUp', this.login)
            .then(() => this.$router.push('/root'));
    }

    public signIn() {
        this.$store.dispatch('signIn')
            .then(() => this.$router.push('/root'));
    }
}
</script>

<style lang="scss">
    @import url('../assets/scss/Sign.scss');
</style>