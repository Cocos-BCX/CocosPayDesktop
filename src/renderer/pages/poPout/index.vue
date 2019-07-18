/* eslint-disable no-new */
<template>
  <section class="popout">
    <section v-if="windowMessage">
      <link-app
        v-if="popupType === 'linkApp' && !isLocked"
        :payload="payload"
        :plugin-origin="pluginOrigin"
        @returned="returnResult"
      ></link-app>
      <transfer-request
        v-if="popupType === apiActions.REQUEST_TRANSFER"
        :payload="payload"
        :plugin-origin="pluginOrigin"
        @returned="returnResult"
      ></transfer-request>
      <contract
        v-if="[apiActions.CALLCONTRACTFUNCTION,apiActions.CREATE_NH_ASSET_ORDER,apiActions.TRANSFER_NH_ASSET,apiActions.FILL_NH_ASSET_ORDER ,apiActions.CANCEL_NH_ASSET_ORDER].indexOf(popupType) !== -1"
        :payload="payload"
        :popupType="popupType"
        :plugin-origin="pluginOrigin"
        @returned="returnResult"
      ></contract>
      <!-- <createnhorder
        v-if="popupType === apiActions.CREATE_NH_ASSET_ORDER"
        :payload="payload"
        :plugin-origin="pluginOrigin"
        @returned="returnResult"
      ></createnhorder>
      <orderdeal v-if :payload="payload" :plugin-origin="pluginOrigin" @returned="returnResult"></orderdeal>-->
    </section>
    <locked v-else></locked>
  </section>
</template>
<script>
// export const TRANSFER_NH_ASSET = 'transferNHAsset'
// export const CREATE_NH_ASSET_ORDER = 'creatNHAssetOrder'
// export const FILL_NH_ASSET_ORDER = 'fillNHAssetOrder'
// export const CANCEL_NH_ASSET_ORDER = 'cancelNHAssetOrder'
import { mapMutations, mapState } from "vuex";
import Cocos from "../../models/cocos";
import WindowService from "../../services/windowService";
import * as ApiActions from "../../models/apiActions";
const { remote } = window.require("electron");

export default {
  data() {
    return {
      apiActions: ApiActions,
      windowMessage: null
    };
  },
  mounted() {
    WindowService.watch("popup", windowMessage => {
      this.windowMessage = windowMessage;
      const cocos = this.windowMessage.data.cocos;
      this["setCocos"](Cocos.fromJson(cocos));
    });
  },
  computed: {
    ...mapState(["cocos", "isLocked"]),
    pluginOrigin() {
      return this.windowMessage.data.popup.data.props.plugin;
    },
    payload() {
      return this.windowMessage.data.popup.data.props.payload;
    },
    popupType() {
      return this.windowMessage.data.popup.data.type;
    }
  },
  methods: {
    async returnResult(result) {
      WindowService.sendResult(this.windowMessage, result);
      setTimeout(() => remote.getCurrentWindow().close(), 0);
    },
    ...mapMutations(["setCocos"])
  }
};
</script>

<style scoped lang="scss" rel="stylesheet/scss">
@import "../../styles/_variables.scss";

.popout {
  position: relative;
}
</style>
