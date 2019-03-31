<template>
    <v-flex xs12 sm12 md8 offset-md2 lg8 offset-lg2 xl6 offset-xl-3>
        <v-sheet
            elevation="6">
            <v-form @submit.prevent="editProfile">
                <v-container class="settingsHeader">
                    <v-layout>
                        <v-flex xs12 sm5>
                            <label for="selectAvatar">
                                <v-hover>
                                    <v-avatar
                                        slot-scope="{ hover }"
                                        :class="`elevation-${hover ? 8 : 2}`"
                                        size="125"
                                        d-inlinte-flex>
                                        <img :src="myProfile.avatarUrl"/>
                                    </v-avatar>
                                </v-hover>
                            </label>
                            <input
                                id="selectAvatar"
                                type="file"
                                class="selectAvatar"/>
                        </v-flex>

                        <v-flex xs12 sm7>
                            <v-text-field
                                lazy-validation
                                :counter="20"
                                dark
                                required
                                label="Login"
                                :value="myProfile.login">
                            </v-text-field>
                            <v-text-field
                                :counter="20"
                                dark
                                label="Username"
                                :value="myProfile.nickname">
                            </v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-btn
                        type="submit"
                        absolute
                        right
                        fab
                        color="primary">
                        <v-icon d-inline-flex>done</v-icon>
                    </v-btn>
                </v-container>

                <v-container class="profile">
                    <v-layout row wrap>

                        <v-flex xs12>
                            <v-textarea
                                label="Bio"
                                :value="myProfile.bio">
                            </v-textarea>
                        </v-flex>

                        <v-flex xs12>
                            <v-select
                                label="Theme"
                                :items="themas">
                            </v-select>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-form>
        </v-sheet>
    </v-flex>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Profile extends Vue {
    get myProfile() {
        return this.$store.state.myAccount;
    }

    public themas = [
        'Default',
        'Material Light',
        'Material Dark',
    ];

    public editProfile() {
        console.log('ep');
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/Profile";
</style>
