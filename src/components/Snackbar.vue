<template>
    <v-snackbar
        :timeout="duration"
        v-model="showSnackbar"
    >
        {{this.message}}
        <v-btn
            flat
            @click="showSnackbarAlert = false"
        >
            close
        </v-btn>
    </v-snackbar>
</template>


<script lang="ts">

import {Component, Vue, Watch} from "vue-property-decorator";

@Component
export default class Snackbar extends Vue {

    public showSnackbar = false;
    public message = '';
    public duration = 500;

    @Watch('$store.state.snackbar')
    onSnackbarMessage(val) {
        this.showSnackbar = true;
        this.message = val.message;
        this.duration = val.duration;
    }
}

</script>