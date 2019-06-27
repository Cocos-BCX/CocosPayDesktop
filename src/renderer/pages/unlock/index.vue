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
import { fail } from "assert";
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
  mounted() {
    this.init().then(res => {
      this.getAccounts().then(res => {
        this.setAccountType(res.current_account.mode);
        this.connectSocket();
      });
      this.AccountLogin(false);
    });
    this.AccountLogin(false);
  },
  name: "unlock",
  methods: {
    ...mapActions(["init", "IndexedDBAdd"]),
    ...mapMutations(["setAccountType"]),
    ...mapActions("wallet", ["getAccounts"]),
    ...mapMutations(["setAccount", "setCocos", "setLoginNoAlert"]),
    ...mapActions("account", ["unlockAccount", "loginBCXAccount"]),
    ...mapMutations("common", ["AccountLogin"]),
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
          if (res.code === 1) {
            this.setAccount({
              account: this.cocosAccount.accounts,
              password: ""
            });
            this.setLoginNoAlert(true);
            this.connectSocket();
            this.$router.push({ name: "home" });
          } else {
            this.accountLogin();
          }
        });
      } else {
        this.accountLogin();
      }
    },
    connectSocket() {
      SocketService.initialize();
      if (!this.cocos) {
        const cocos = Cocos.placeholder();
        this.setCocos(cocos);
      } else if (!(this.cocos instanceof Cocos)) {
        let sfj = JSON.parse(JSON.stringify(this.cocos));
        const cocos = Cocos.fromJson(sfj);
        this.setCocos(cocos);
      }
    },
    accountLogin() {
      this.loginBCXAccount().then(res => {
        if (res.code === 1) {
          this.setAccount({
            account: this.cocosAccount.accounts,
            password: ""
          });
          // this.IndexedDBAdd({ name: this.cocosAccount.accounts });
          this.connectSocket();
          this.$router.push({ name: "home" });
        } else {
          this.init().then(res => {
            this.getAccounts().then(account => {
              this.setAccountType(account.current_account.mode);
            });
          });
        }
      });
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
