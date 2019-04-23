<template>
    <v-flex xl12 lg8 offset-lg2 md8 offset-md2 sm10 offset-sm1 xs12>
        <v-sheet
            elevation="6">
            <div class="sign">
                <!--<img src="../assets/LastLogopsd.png"-->
                     <!--class="logo"/>-->
                <v-form
                    v-if="isSignUp"
                    @submit.prevent="signUp"
                    v-model="isValid">
                    <v-text-field
                        v-model="login"
                        :counter="20"
                        :rules="rules.loginRule"
                        label="Login">
                    </v-text-field>

                    <v-btn
                        block
                        type="submit"
                        v-model="isValid">
                        Sign up
                    </v-btn>
                </v-form>

                <v-form v-else @submit.prevent="signIn">
                    <v-btn block type="submit">
                        Sign in
                    </v-btn>
                </v-form>
            </div>
        </v-sheet>
    </v-flex>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Action } from 'vuex-class';

@Component
export default class Sign extends Vue {

    @Prop({type: Boolean, default: false})
    public isSignUp: boolean;

    @Action('signUp', { namespace: 'Auth' })
    private signUpAction;

    @Action('signIn', { namespace: 'Auth' })
    private signInAction;

    public login = '';

    public isValid = false;
    public rules = {
        loginRule: [
            (v) => !!v || 'Login is required field',
            (v) => (v.length >= 3 && v.length <= 20) || 'Login must be longer then 3 and less then 20 characters',
        ],
    };

    public async signUp() {
        if (this.isValid) {
            await this.signUpAction(this.login);
            this.$router.push('/root');
        }
    }

    public async signIn() {
        await this.signInAction();
        this.$router.push('/root');
    }
}
</script>

<style lang="scss">
    @import url('../assets/scss/pages/Sign.scss');
</style>