<template>
  <section class="panel">
    <section class="unlock" v-if="unlock">
      <section class="mt40">
        <img src="../../assets/img/128px.png" alt>
        <p>{{$t('placeholder.password')}}</p>
        <div class="input-box">
          <el-input
            clear="no-margin"
            v-model="password"
            type="password"
            @keyup.enter.native="unlockWallet"
            :placeholder="$t('placeholder.password')"
          ></el-input>
          <i @click="unlockWallet" class="right-arrow"></i>
        </div>
      </section>
    </section>
    <section v-else>
      <section class="piece no-margin">
        <span>{{$t('title.activeKey')}}(active)</span>
        <p>{{$t('message.accountActive')}}</p>
        <section>
          <div class="keys">{{temporaryKeys}}</div>
          <el-button @click="copySuccess(temporaryKeys)" type="primary">{{$t('button.copy')}}</el-button>
        </section>
      </section>
      <section class="piece">
        <span>{{$t('title.ownerKey')}}(owner)</span>
        <p>{{$t('message.accountOwner')}}</p>
        <section>
          <div class="keys">{{privateKeys}}</div>
          <el-button type="primary" @click="copySuccess(privateKeys)">{{$t('button.copy')}}</el-button>
        </section>
      </section>
    </section>
  </section>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { clipboard } from "electron";
export default {
  name: "storeAccount",
  data() {
    return {
      unlock: true,
      password: ""
    };
  },
  computed: {
    ...mapState(["privateKeys", "temporaryKeys", , "cocosAccount"])
  },
  methods: {
    ...mapActions("account", ["OutPutKey"]),
    ...mapActions("account", ["loginBCXAccount"]),
    ...mapMutations(["settemporaryKeys", "setKeys", "setAccount"]),
    copySuccess(key) {
      clipboard.writeText(key);
      this.$kalert({
        message: this.$i18n.t("alert.copySuccess")
      });
    },
    unlockWallet() {
      if (!this.password) {
        this.$kalert({
          message: this.$i18n.t("placeholder.password")
        });
        return;
      }
      this.setAccount({
        account: this.cocosAccount.accounts,
        password: this.password
      });
      this.loginBCXAccount().then(res => {
        this.setAccount({
          account: this.cocosAccount.accounts,
          password: ""
        });
        if (res.code === 1) {
          this.unlock = false;
        }
      });
    }
  },
  mounted() {
    this.OutPutKey().then(key => {
      this.settemporaryKeys(key.data.active_private_keys);
      this.setKeys(key.data.owner_private_keys);
    });
  },
  destroyed() {
    this.settemporaryKeys("");
    this.setKeys("");
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/unlock.scss";
@import "../../styles/settings.scss";
</style>