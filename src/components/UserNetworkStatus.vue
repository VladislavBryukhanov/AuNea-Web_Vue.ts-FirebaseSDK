<template>
    <span class="onlineStatus" :class="statusIndicator"></span>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class UserNetworkStatus extends Vue {

    private readonly ONLINE_STATUS = 'Online';
    private readonly OFFLINE_STATUS = 'Last seen at';
    private readonly AFK_STATUS = 'AFK';

    @Prop(String)
    public userStatus: string;

    get statusIndicator() {
        if (this.userStatus.includes(this.ONLINE_STATUS)) {
            return 'online';
        } else if (this.userStatus.includes(this.AFK_STATUS)) {
            return 'afk';
        } else if (this.userStatus.includes(this.OFFLINE_STATUS)) {
            return '';
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../assets/scss/components/UserNetworkStatus";
</style>