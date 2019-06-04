<template>
  <div class="unlock">
    <app-header/>
    <section>
      <img src="../../assets/img/128px.png" alt>
      <p>{{$t('title.welcome')}}</p>
      <div class="input-box">
        <el-input
          clear="no-margin"
          v-model="unlock"
          type="password"
          @keyup.enter.native="unlockWallet"
          :placeholder="$t('placeholder.password')"
        ></el-input>
        <i @click="unlockWallet" class="right-arrow"></i>
      </div>
    </section>
  </div>
</template>
<script>
import AppHeader from "@/components/app-header";
import { mapState, mapMutations, mapActions } from "vuex";
import SocketService from "@/services/socketService";
import Cocos from "@/models/cocos";
import utils from "../../utils/utils";
export default {
  data() {
    return {
      unlock: "",
      num: 5
    };
  },
  components: {
    AppHeader
  },
  computed: {
    ...mapState(["cocosAccount", "cocos", "accountType"])
  },
  mounted() {},
  name: "unlock",
  methods: {
    ...mapMutations(["setAccount", "setCocos"]),
    ...mapActions("account", ["unlockAccount", "loginBCXAccount"]),
    unlockWallet() {
      if (!this.unlock) {
        this.$kalert({
          message: this.$i18n.t("placeholder.password")
        });
        return;
      }
      this.setAccount({
        account: this.cocosAccount.accounts,
        password: this.unlock
      });
      if (this.accountType === "wallet") {
        this.unlockAccount().then(res => {
          this.setAccount({
            account: this.cocosAccount.accounts,
            password: ""
          });
          SocketService.initialize();
          if (res.code === 1) {
            if (!this.cocos) {
              const cocos = Cocos.placeholder();
              this.setCocos(cocos);
            } else if (!(this.cocos instanceof Cocos)) {
              let sfj = JSON.parse(JSON.stringify(this.cocos));
              const cocos = Cocos.fromJson(sfj);
              this.setCocos(cocos);
            }
            this.$router.push({ name: "home" });
          }
        });
      } else {
        this.loginBCXAccount().then(res => {
          this.setAccount({
            account: this.cocosAccount.accounts,
            password: ""
          });
          SocketService.initialize();
          if (res.code === 1) {
            if (!this.cocos) {
              const cocos = Cocos.placeholder();
              this.setCocos(cocos);
            } else if (!(this.cocos instanceof Cocos)) {
              let sfj = JSON.parse(JSON.stringify(this.cocos));
              const cocos = Cocos.fromJson(sfj);
              this.setCocos(cocos);
            }
            this.$router.push({ name: "home" });
          }
        });
      }
    }
  },
  destroyed() {
    this.setAccount({
      account: this.cocosAccount.accounts,
      password: ""
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../styles/unlock.scss";
</style>
